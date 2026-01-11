import express from "express";
import db from "./db.js";
import * as middlewares from "./middlewares/middleware.js";
import "./middlewares/passportConfig.js";

const router = express.Router();

// Enpoint to add item to cart for a specific user, starts with /vsa/shop
router.post("/add-to-cart", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Login required to add item to cart",
        isLoggedIn: false,
      });
    }

    const { itemToAddToCart } = req.body;

    const validation = validateItem(itemToAddToCart);

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Check available stock for the item variation
    const [stockCheck] = await connection.query(
      `SELECT quantity FROM ${itemToAddToCart.itemType}_variation 
       WHERE item_id = ? AND item_variation_id = ?`,
      [itemToAddToCart.itemId, itemToAddToCart.itemVariationId]
    );

    if (!stockCheck || stockCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Item variation not found",
      });
    }

    const availableStock = stockCheck[0].quantity;

    // Determine if item is custom
    const isCustom = !!(
      itemToAddToCart.customizations &&
      Object.keys(itemToAddToCart.customizations).length > 0
    );

    let cartId;
    let isNewItem = false;
    let finalQuantity = itemToAddToCart.quantity;

    if (isCustom) {
      // For custom items, check if requested quantity is available
      if (itemToAddToCart.quantity > availableStock) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${availableStock} items available`,
          availableStock: availableStock,
        });
      }

      // Create new cart entry for custom item
      const [cartRow] = await connection.query(
        `INSERT INTO cart 
        (user_id, item_id, item_variation_id, item_type, quantity, is_custom)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.userId,
          itemToAddToCart.itemId,
          itemToAddToCart.itemVariationId,
          itemToAddToCart.itemType,
          itemToAddToCart.quantity,
          true,
        ]
      );

      cartId = cartRow.insertId;
      isNewItem = true;

      // Insert customizations
      const values = Object.entries(itemToAddToCart.customizations).map(
        ([key, { value, extraPrice }]) => [cartId, key, value, extraPrice || 0]
      );

      if (values.length > 0) {
        await connection.query(
          `INSERT INTO cart_item_customization 
          (cart_item_id_fk, customization_type, customization_value, extra_price)
          VALUES ?`,
          [values]
        );
      }
    } else {
      // For non-custom items, check for existing entry
      const [existing] = await connection.query(
        `SELECT id, quantity FROM cart 
         WHERE user_id = ? AND item_id = ? AND item_variation_id = ? AND is_custom = FALSE`,
        [
          req.user.userId,
          itemToAddToCart.itemId,
          itemToAddToCart.itemVariationId,
        ]
      );

      if (existing.length > 0) {
        // Calculate new total quantity
        const newTotalQuantity =
          existing[0].quantity + itemToAddToCart.quantity;

        // Check if new total exceeds available stock
        if (newTotalQuantity > availableStock) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock. You have ${existing[0].quantity} in cart. Only ${availableStock} total available`,
            currentCartQuantity: existing[0].quantity,
            requestedQuantity: itemToAddToCart.quantity,
            availableStock: availableStock,
            maxCanAdd: Math.max(0, availableStock - existing[0].quantity),
          });
        }

        // Update existing non-custom item
        finalQuantity = newTotalQuantity;

        await connection.query(
          `UPDATE cart SET quantity = ?, last_activity_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [newTotalQuantity, existing[0].id]
        );
        cartId = existing[0].id;
      } else {
        // Check if requested quantity is available for new cart entry
        if (itemToAddToCart.quantity > availableStock) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock. Only ${availableStock} items available`,
            availableStock: availableStock,
          });
        }

        // Create new non-custom cart entry
        const [cartRow] = await connection.query(
          `INSERT INTO cart 
          (user_id, item_id, item_variation_id, item_type, quantity, is_custom)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            req.user.userId,
            itemToAddToCart.itemId,
            itemToAddToCart.itemVariationId,
            itemToAddToCart.itemType,
            itemToAddToCart.quantity,
            false,
          ]
        );

        cartId = cartRow.insertId;
        isNewItem = true;
      }
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cartId: cartId,
      isNewItem: isNewItem,
      finalQuantity: finalQuantity,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (connection) await connection.rollback();

    return res.status(500).json({
      success: false,
      message: "Internal server error while adding item to cart",
    });
  } finally {
    if (connection) connection.release();
  }
});

function validateItem(item) {
  // Check if item exists
  if (!item || typeof item !== "object") {
    return {
      success: false,
      message: "Invalid request: no item data provided",
    };
  }

  // Validate quantity
  if (
    !item.quantity ||
    typeof item.quantity !== "number" ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return {
      success: false,
      message: "Invalid quantity: must be a positive integer",
    };
  }

  // Maximum quantity check
  if (item.quantity > 999) {
    return {
      success: false,
      message: "Quantity exceeds maximum limit of 999",
    };
  }

  // Validate item IDs
  if (
    !item.itemId ||
    typeof item.itemId !== "string" ||
    item.itemId.trim() === ""
  ) {
    return {
      success: false,
      message: "Missing or invalid item ID",
    };
  }

  if (
    !item.itemVariationId ||
    typeof item.itemVariationId !== "string" ||
    item.itemVariationId.trim() === ""
  ) {
    return {
      success: false,
      message: "Missing or invalid item variation ID",
    };
  }

  // Check ID length constraints (based on VARCHAR limits)
  if (item.itemId.length > 20) {
    return {
      success: false,
      message: "Item ID too long (max 20 characters)",
    };
  }

  if (item.itemVariationId.length > 70) {
    return {
      success: false,
      message: "Item variation ID too long (max 70 characters)",
    };
  }

  // Validate item type
  const validItemType = [
    "skates_and_boots",
    "wheels",
    "helmets",
    "accessories",
    "bearings",
  ];

  if (!item.itemType || !validItemType.includes(item.itemType)) {
    return {
      success: false,
      message: "Invalid item type",
    };
  }

  // Validate customizations if present
  if (item.customizations) {
    if (
      typeof item.customizations !== "object" ||
      Array.isArray(item.customizations)
    ) {
      return {
        success: false,
        message: "Customizations must be an object",
      };
    }

    const validCustomizationType = [
      "name_print",
      "color_strip",
      "text",
      "number",
      "custom_color",
    ];

    for (const key in item.customizations) {
      // Validate customization type
      if (!validCustomizationType.includes(key)) {
        return {
          success: false,
          message: `Invalid customization type: ${key}`,
        };
      }

      const customization = item.customizations[key];

      // Validate customization structure
      if (!customization || typeof customization !== "object") {
        return {
          success: false,
          message: `Invalid customization data for: ${key}`,
        };
      }

      // Validate customization value
      if (!customization.value || typeof customization.value !== "string") {
        return {
          success: false,
          message: `Missing or invalid value for customization: ${key}`,
        };
      }

      // Check value length (VARCHAR(255) in DB)
      if (customization.value.length > 255) {
        return {
          success: false,
          message: `Customization value too long for ${key} (max 255 characters)`,
        };
      }

      // Validate extra price if provided
      if (
        customization.extraPrice !== undefined &&
        customization.extraPrice !== null
      ) {
        const price = Number(customization.extraPrice);

        if (isNaN(price) || price < 0) {
          return {
            success: false,
            message: `Invalid extra price for customization: ${key}`,
          };
        }

        // Max price check (DECIMAL(10,2) means max 99999999.99)
        if (price > 99999999.99) {
          return {
            success: false,
            message: `Extra price too high for customization: ${key}`,
          };
        }
      }
    }
  }

  return {
    success: true,
    message: "Validation passed",
  };
}

function validateItemType(itemType) {
  // Validate item type
  const validItemType = [
    "skates_and_boots",
    "wheels",
    "helmets",
    "accessories",
    "bearings",
  ];

  if (!itemType || !validItemType.includes(itemType)) {
    return {
      success: false,
      message: "Invalid item type",
    };
  }

  return {
    success: true,
    message: "Valid item type",
  };
}

// Enpoint to update the quantity when user click on + or - button in these pages (ProductDetails.vue etc) every click calls this api and increases or decreases the quantity of the item this api is mainly to not let user increase the items quantity to more then whats available.
router.put(
  "/update-item-quantity",
  middlewares.verifyToken,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Login required",
          isLoggedIn: false,
        });
      }

      const {
        itemId,
        itemVariationId,
        itemType,
        isIncrement,
        currentAppliedQuantity,
      } = req.body;

      // Validate inputs
      const validation = validateQuantityUpdate(req.body);
      if (!validation.success) {
        return res.status(400).json(validation);
      }

      const connection = await db.getConnection();

      try {
        const [stockCheck] = await connection.query(
          `SELECT id, quantity FROM ${itemType}_variation 
          WHERE item_id = ? AND item_variation_id = ?`,
          [itemId, itemVariationId]
        );

        if (!stockCheck || stockCheck.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Item variation not found",
          });
        }

        const availableStock = stockCheck[0].quantity;
        let newQuantity;
        let canUpdate = false;
        let message = "";

        if (isIncrement) {
          newQuantity = currentAppliedQuantity + 1;
          
          if (newQuantity <= availableStock) {
            canUpdate = true;
            message = "Increment allowed";
          } else {
            canUpdate = false;
            message = `Cannot add more. Only ${availableStock} items available`;
          }
        } else {
          // Decrement
          newQuantity = currentAppliedQuantity - 1;
          
          if (newQuantity >= 1) {
            canUpdate = true;
            message = "Decrement allowed";
          } else {
            canUpdate = false;
            message = "Quantity cannot be less than 1";
          }
        }

        return res.status(200).json({
          success: canUpdate,
          message: message,
          newQuantity: canUpdate ? newQuantity : currentAppliedQuantity,
          availableStock: availableStock,
        });

      } finally {
        connection.release();
      }

    } catch (error) {
      console.error("Error updating quantity:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while updating quantity",
      });
    }
  }
);

function validateQuantityUpdate(data) {
  // Validate itemId
  if (!data.itemId || typeof data.itemId !== 'string' || data.itemId.trim() === '') {
    return {
      success: false,
      message: "Missing or invalid item ID",
    };
  }

  // Validate itemVariationId
  if (!data.itemVariationId || typeof data.itemVariationId !== 'string' || data.itemVariationId.trim() === '') {
    return {
      success: false,
      message: "Missing or invalid item variation ID",
    };
  }

  const itemTypeValidation = validateItemType(data.itemType);
  if(!itemTypeValidation.success) {
    return itemTypeValidation;
  }

  // Validate isIncrement
  if (typeof data.isIncrement !== 'boolean') {
    return {
      success: false,
      message: "isIncrement must be a boolean",
    };
  }

  // Validate currentAppliedQuantity
  if (
    typeof data.currentAppliedQuantity !== 'number' ||
    !Number.isInteger(data.currentAppliedQuantity) ||
    data.currentAppliedQuantity < 1
  ) {
    return {
      success: false,
      message: "Invalid current quantity: must be a positive integer",
    };
  }

  return {
    success: true,
  };
}

// Endpoint to fetch details of a particular item for product detail page
router.get("/product-detail/:itemVariationId/:itemType", async (req, res) => {
  try {
    const {itemVariationId, itemType} = req.params;
    const validation = validateItemType(itemType);
    if(!validation.success) {
      return res.json(validation);
    }

    const itemDetail = await getProductsDetail(itemType, itemVariationId);
    
    if(!itemDetail) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      message: "Product found",
      data: itemDetail,
      itemType : itemType
    });

  } catch (error) {
    console.error("Error fetching product detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details"
    });
  }
});

async function getItemIdFromVariation(itemType, itemVariationId) {
  const [rows] = await db.query(
    `SELECT item_id 
     FROM ${itemType}_variation 
     WHERE item_variation_id = ?`,
    [itemVariationId]
  );

  return rows.length ? rows[0].item_id : null;
}

async function getProductsDetail(itemType, itemVariationId) {
  const itemId = await getItemIdFromVariation(itemType, itemVariationId);
  if (!itemId) return null;

  // variation-specific columns
  const variationColumns =
    itemType === 'bearings'
      ? `iv.abec_rating, iv.material, iv.size, iv.pack_size, iv.bearing_type`
      : `iv.color, iv.size`;

  const [rawData] = await db.query(
    `
    SELECT 
      i.id AS itemIdPk,
      i.item_id AS itemId,
      i.name,
      i.short_description,
      i.detailed_description,
      i.why_to_choose,
      i.main_image_path,
      i.features,
      i.average_rating,

      iv.id AS itemVariationIdPk,
      iv.item_variation_id,
      ${variationColumns},
      iv.quantity AS availableQuantity,
      iv.old_price,
      iv.current_price,
      iv.discount,
      iv.base_image_path,

      ivimg.id AS itemVariationImageIdPk,
      ivimg.image_path,

      icr.id AS itemCustomerRatingIdPk,
      icr.customer_name,
      icr.comment,
      icr.rating,
      icr.created_at AS ratingDate

    FROM ${itemType} i
    LEFT JOIN ${itemType}_variation iv ON i.item_id = iv.item_id
    LEFT JOIN ${itemType}_variation_image ivimg ON iv.item_variation_id = ivimg.item_variation_id
    LEFT JOIN ${itemType}_customer_ratings icr ON i.item_id = icr.item_id
    WHERE i.item_id = ?
    `,
    [itemId]
  );

  if (!rawData.length) return null;

  const itemDetail = {
    itemIdPk: rawData[0].itemIdPk,
    itemId: rawData[0].itemId,
    name: rawData[0].name,
    shortDescription: rawData[0].short_description,
    detailedDescription: rawData[0].detailed_description,
    whyToChoose: rawData[0].why_to_choose,
    mainImagePath: rawData[0].main_image_path,
    features: rawData[0].features,
    averageRating: rawData[0].average_rating,

    selectedVariationId: itemVariationId,
    variations: [],
    ratings: []
  };

  const variationMap = new Map();

  rawData.forEach(row => {
    if (!variationMap.has(row.item_variation_id)) {
      variationMap.set(row.item_variation_id, {
        itemVariationIdPk: row.itemVariationIdPk,
        itemVariationId: row.item_variation_id,
        ...(itemType === 'bearings'
          ? {
              abecRating: row.abec_rating,
              material: row.material,
              size: row.size,
              packSize: row.pack_size,
              bearingType: row.bearing_type
            }
          : {
              color: row.color,
              size: row.size
            }),
        availableQuantity: row.availableQuantity,
        oldPrice: row.old_price,
        currentPrice: row.current_price,
        discount: row.discount,
        baseImagePath: row.base_image_path,
        images: [],
        imageIds: new Set() 
      });
    }

    // Add variation images (avoid duplicates)
    const variation = variationMap.get(row.item_variation_id);
    if (row.itemVariationImageIdPk && !variation.imageIds.has(row.itemVariationImageIdPk)) {
      variation.imageIds.add(row.itemVariationImageIdPk);
      variation.images.push({
        id: row.itemVariationImageIdPk,
        imagePath: row.image_path
      });
    }
  });

  // Convert to array and remove the tracking Set
  itemDetail.variations = Array.from(variationMap.values()).map(variation => {
    const { imageIds, ...rest } = variation;
    return rest;
  });

  // 6. ratings
  const ratingIds = new Set();
  rawData.forEach(row => {
    if (row.itemCustomerRatingIdPk && !ratingIds.has(row.itemCustomerRatingIdPk)) {
      ratingIds.add(row.itemCustomerRatingIdPk);
      itemDetail.ratings.push({
        id: row.itemCustomerRatingIdPk,
        customerName: row.customer_name,
        comment: row.comment,
        rating: row.rating,
        ratingDate: row.ratingDate
      });
    }
  });

  return itemDetail;
}

// Endpoint to render the items in cart base url is /vsa/shop
router.get("/cart", middlewares.verifyToken, async (req, res) => {
  let connection;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
        isLoggedIn: false,
      });
    }

    const userId = req.user.userId;
    connection = await db.getConnection();
    await connection.beginTransaction();

    console.log("userID " + userId);
    const [cartItems] = await connection.query(
      `SELECT 
        c.id AS cart_id,
        c.item_id,
        c.item_variation_id,
        c.item_type,
        c.quantity,
        c.is_custom,
        c.currency,
        cic.cart_item_customization_id,
        cic.customization_type,
        cic.customization_value,
        cic.extra_price
      FROM cart c
      LEFT JOIN cart_item_customization cic
        ON c.id = cic.cart_item_id_fk
      WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      await connection.commit();
      return res.json({
        success: true,
        items: [],
      });
    }

    console.log("itemType " + cartItems);
    const ALLOWED_ITEM_TYPES = ["skates_and_boots", "helmets", "bearings", "wheels", "accessories"];
    const itemsByType = {};
    for (const item of cartItems) {      
      if (!ALLOWED_ITEM_TYPES.includes(item.item_type)) continue;
      if (!itemsByType[item.item_type]) {
        itemsByType[item.item_type] = [];
      }
      itemsByType[item.item_type].push(item);
    }

    const detailedItems = [];

    for (const itemType of Object.keys(itemsByType)) {
      const itemIds = itemsByType[itemType].map(i => i.item_id);
      const variationIds = itemsByType[itemType].map(i => i.item_variation_id);

      const [itemDetails] = await connection.query(
        `SELECT 
          i.id AS item_parent_id_pk,
          i.item_id,
          i.name,
          i.main_image_path,
          i.average_rating,
          iv.id AS item_variation_id_pk,
          iv.item_variation_id,
          iv.old_price,
          iv.current_price,
          iv.quantity
        FROM ${itemType} i
        JOIN ${itemType}_variation iv
          ON i.item_id = iv.item_id
        WHERE i.item_id IN (?)
          AND iv.item_variation_id IN (?)`,
        [itemIds, variationIds]
      );

      detailedItems.push(...itemDetails);
    }

    await connection.commit();

    return res.json({
      success: true,
      cartItems,
      itemDetails: detailedItems,
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Cart fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to remove item from cart
router.delete("/delete-cart-item/:cartId", middlewares.verifyToken, async (req, res) => {
  let connection;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
        isLoggedIn: false,
      });
    }

    const { cartId } = req.params;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId is required",
      });
    }

    const userId = req.user.userId;
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [[cartItem]] = await connection.query(
      `SELECT id FROM cart WHERE id = ? AND user_id = ?`,
      [cartId, userId]
    );

    if (!cartItem) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized or cart item not found",
      });
    }

    await connection.query(
      `DELETE FROM cart WHERE id = ?`,
      [cartId]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Removed successfully",
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Delete cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to update quantity for a item in cart 
router.put("/update-cart-item-quantity", middlewares.verifyToken, async (req, res) => {
  let connection;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
        isLoggedIn: false,
      });
    }

    const {
      cartId,
      itemId,
      itemVariationId,
      itemType,
      isIncrement,
      currentAppliedQuantity,
    } = req.body;

    if (!cartId || !itemId || !itemVariationId || !itemType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const ALLOWED_ITEM_TYPES = [
      "skates_and_boots",
      "wheels",
      "helmets",
      "bearings",
      "accessories",
    ];

    if (!ALLOWED_ITEM_TYPES.includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item type",
      });
    }

    const userId = req.user.userId;
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [[cartItem]] = await connection.query(
      `SELECT quantity FROM cart WHERE id = ? AND user_id = ?`,
      [cartId, userId]
    );

    if (!cartItem) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized or cart item not found",
      });
    }

    const [[stockRow]] = await connection.query(
      `SELECT quantity 
       FROM ${itemType}_variation
       WHERE item_id = ? AND item_variation_id = ?`,
      [itemId, itemVariationId]
    );

    if (!stockRow) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Item variation not found",
      });
    }

    const availableStock = stockRow.quantity;
    let newQuantity = currentAppliedQuantity;
    let message = "";

    if (isIncrement) {
      if (currentAppliedQuantity + 1 > availableStock) {
        await connection.rollback();
        return res.status(200).json({
          success: false,
          message: `Only ${availableStock} items available`,
          newQuantity: currentAppliedQuantity,
          availableStock,
        });
      }
      newQuantity += 1;
      message = "Quantity increased";
    } else {
      if (currentAppliedQuantity - 1 < 1) {
        await connection.rollback();
        return res.status(200).json({
          success: false,
          message: "Quantity cannot be less than 1",
          newQuantity: currentAppliedQuantity,
          availableStock,
        });
      }
      newQuantity -= 1;
      message = "Quantity decreased";
    }

    await connection.query(
      `UPDATE cart 
       SET quantity = ?, last_activity_at = NOW()
       WHERE id = ?`,
      [newQuantity, cartId]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message,
      newQuantity,
      availableStock,
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error updating cart quantity:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating quantity",
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to render the items as per itemType, starts with /vsa/shop keeping this at the end as it causes a problem to other routes
router.get("/:itemType", async (req, res) => {
  try {
    const { itemType } = req.params;
    const validItemType = [
      "skates_and_boots",
      "wheels",
      "helmets",
      "accessories",
      "bearings",
    ];
    if (!validItemType.includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item type",
      });
    }

    const [items] = await db.query(
      `SELECT 
        i.id AS item_parent_id_pk, 
        i.item_id AS item_id, 
        i.name, i.main_image_path, i.average_rating,
        iv.id AS item_variation_id_pk,
        iv.item_variation_id,
        iv.old_price,
        iv.current_price,
        iv.quantity
        FROM ${itemType} AS i 
        LEFT JOIN ${itemType}_variation AS iv
        ON i.item_id = iv.item_id
        WHERE iv.show_on_main_page = 1`
    );

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No item with this item type",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${itemType} fetched successfully`,
      items: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching items data",
    });
  }
});

// Add more shop-specific routes here
export default router;

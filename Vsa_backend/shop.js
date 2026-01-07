import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db.js";
import nodemailer from "nodemailer";
import * as middlewares from "./middlewares/middleware.js";
import "./middlewares/passportConfig.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const router = express.Router();

// Endpoint to render the items as per itemType, starts with /vsa/shop
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

  const itemTypeValidation = validateItemType(item.itemType);
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



// Add more shop-specific routes here
export default router;

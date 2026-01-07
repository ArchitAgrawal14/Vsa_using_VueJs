-- Table related to shop 
-- Skates and Boots scripts
CREATE TABLE skates_and_boots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    short_description VARCHAR(150),
    detailed_description TEXT,
    why_to_choose VARCHAR(255),
    main_image_path VARCHAR(255),
    features TEXT,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    is_shown BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_items (is_shown, deleted_at)
);

CREATE TABLE skates_and_boots_variation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL UNIQUE,  -- This will be the combination of color + size + item_id
  item_id VARCHAR(20) NOT NULL,
  color VARCHAR(30) NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  current_price DECIMAL(10,2) NOT NULL,
  discount TINYINT UNSIGNED CHECK (discount BETWEEN 0 AND 100) DEFAULT 0,
  base_image_path VARCHAR(255) NOT NULL,
  show_on_main_page BOOLEAN DEFAULT FALSE,
  show_as_variation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES skates_and_boots(item_id)  ON DELETE CASCADE,
  INDEX idx_item_color_size (item_id, color, size),
  UNIQUE (item_id, color, size)
);

CREATE TABLE skates_and_boots_variation_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_variation_id) REFERENCES skates_and_boots_variation(item_variation_id) ON DELETE CASCADE,
  INDEX(item_variation_id)
);

CREATE TABLE skates_and_boots_customer_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  comment VARCHAR(250),
  rating DECIMAL(3,1), -- This will be out of 10.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES skates_and_boots(item_id) ON DELETE CASCADE,
  INDEX idx_item_ratings (item_id, created_at DESC),
  CHECK (rating BETWEEN 1 AND 10)
);


-- For Wheels
CREATE TABLE wheels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    short_description VARCHAR(150),
    detailed_description TEXT,
    why_to_choose VARCHAR(255),
    main_image_path VARCHAR(255),
    features TEXT,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    is_shown BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_items (is_shown, deleted_at)
);

CREATE TABLE wheels_variation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL UNIQUE,  -- This will be the combination of color + size + item_id
  item_id VARCHAR(20) NOT NULL,
  color VARCHAR(30) NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  current_price DECIMAL(10,2) NOT NULL,
  discount TINYINT UNSIGNED CHECK (discount BETWEEN 0 AND 100) DEFAULT 0,
  base_image_path VARCHAR(255) NOT NULL,
  show_on_main_page BOOLEAN DEFAULT FALSE,
  show_as_variation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES wheels(item_id)  ON DELETE CASCADE,
  INDEX idx_item_color_size (item_id, color, size),
  UNIQUE (item_id, color, size)
);

CREATE TABLE wheels_variation_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_variation_id) REFERENCES wheels_variation(item_variation_id) ON DELETE CASCADE,
  INDEX(item_variation_id)
);

CREATE TABLE wheels_customer_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  comment VARCHAR(250),
  rating DECIMAL(3,1), -- This will be out of 10.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES wheels(item_id) ON DELETE CASCADE,
  INDEX idx_item_ratings (item_id, created_at DESC),
  CHECK (rating BETWEEN 1 AND 10)
);

-- For helmets

CREATE TABLE helmets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    short_description VARCHAR(150),
    detailed_description TEXT,
    why_to_choose VARCHAR(255),
    main_image_path VARCHAR(255),
    features TEXT,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    is_shown BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_items (is_shown, deleted_at)
);

CREATE TABLE helmets_variation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL UNIQUE,  -- This will be the combination of color + size + item_id
  item_id VARCHAR(20) NOT NULL,
  color VARCHAR(30) NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  current_price DECIMAL(10,2) NOT NULL,
  discount TINYINT UNSIGNED CHECK (discount BETWEEN 0 AND 100) DEFAULT 0,
  base_image_path VARCHAR(255) NOT NULL,
  show_on_main_page BOOLEAN DEFAULT FALSE,
  show_as_variation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES helmets(item_id) ON DELETE CASCADE,
  INDEX idx_item_color_size (item_id, color, size),
  UNIQUE (item_id, color, size)
);

CREATE TABLE helmets_variation_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_variation_id) REFERENCES helmets_variation(item_variation_id) ON DELETE CASCADE,
  INDEX(item_variation_id)
);

CREATE TABLE helmets_customer_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  comment VARCHAR(250),
  rating DECIMAL(3,1), -- This will be out of 10.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES helmets(item_id) ON DELETE CASCADE,
  INDEX idx_item_ratings (item_id, created_at DESC),
  CHECK (rating BETWEEN 1 AND 10)
);

-- For bearings

CREATE TABLE bearings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    short_description VARCHAR(150),
    detailed_description TEXT,
    why_to_choose VARCHAR(255),
    main_image_path VARCHAR(255),
    features TEXT,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    is_shown BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_items (is_shown, deleted_at)
);

CREATE TABLE bearings_variation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(100) NOT NULL UNIQUE, 
  item_id VARCHAR(20) NOT NULL,
  abec_rating VARCHAR(20),         -- ABEC-5, ABEC-7 etc.
  material ENUM('Steel','Ceramic','Titanium'),
  size VARCHAR(15),
  pack_size INT UNSIGNED,         -- 8, 16, 32
  bearing_type VARCHAR(20),       -- 608RS, 608ZZ
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  current_price DECIMAL(10,2) NOT NULL,
  discount TINYINT UNSIGNED CHECK (discount BETWEEN 0 AND 100) DEFAULT 0,
  base_image_path VARCHAR(255) NOT NULL,
  show_on_main_page BOOLEAN DEFAULT FALSE,
  show_as_variation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES bearings(item_id) ON DELETE CASCADE,
  INDEX idx_item_abec_material (item_id, abec_rating, material),  
  UNIQUE (item_id, abec_rating, material,  size, pack_size, bearing_type)
);

CREATE TABLE bearings_variation_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_variation_id) REFERENCES bearings_variation(item_variation_id) ON DELETE CASCADE,
  INDEX(item_variation_id)
);

CREATE TABLE bearings_customer_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  comment VARCHAR(250),
  rating DECIMAL(3,1), -- This will be out of 10.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES bearings(item_id) ON DELETE CASCADE,
  INDEX idx_item_ratings (item_id, created_at DESC),
  CHECK (rating BETWEEN 1 AND 10)
);

-- For accessories

CREATE TABLE accessories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    short_description VARCHAR(150),
    detailed_description TEXT,
    why_to_choose VARCHAR(255),
    main_image_path VARCHAR(255),
    features TEXT,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    is_shown BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_items (is_shown, deleted_at)
);

CREATE TABLE accessories_variation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL UNIQUE,  -- This will be the combination of color + size + item_id
  item_id VARCHAR(20) NOT NULL,
  color VARCHAR(30) NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  current_price DECIMAL(10,2) NOT NULL,
  discount TINYINT UNSIGNED CHECK (discount BETWEEN 0 AND 100) DEFAULT 0,
  base_image_path VARCHAR(255) NOT NULL,
  show_on_main_page BOOLEAN DEFAULT FALSE,
  show_as_variation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES accessories(item_id) ON DELETE CASCADE,
  INDEX idx_item_color_size (item_id, color, size),
  UNIQUE (item_id, color, size)
);

CREATE TABLE accessories_variation_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_variation_id VARCHAR(70) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_variation_id) REFERENCES accessories_variation(item_variation_id) ON DELETE CASCADE,
  INDEX(item_variation_id)
);

CREATE TABLE accessories_customer_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  comment VARCHAR(250),
  rating DECIMAL(3,1), -- This will be out of 10.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES accessories(item_id) ON DELETE CASCADE,
  INDEX idx_item_ratings (item_id, created_at DESC),
  CHECK (rating BETWEEN 1 AND 10)
);


CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(40) NOT NULL UNIQUE,
    pg_order_id VARCHAR(100) DEFAULT NULL,
    pg_payment_id VARCHAR(100) DEFAULT NULL,
    pg_signature VARCHAR(255) DEFAULT NULL,
    user_id INT NOT NULL,
    users_address_id INT NOT NULL,
    order_status ENUM('pending','payment_pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled',  'refunded') NOT NULL DEFAULT 'pending',
    payment_status ENUM('created', 'authorized', 'captured', 'failed', 'refunded') DEFAULT 'created',
    payment_method VARCHAR(50) DEFAULT 'upi',
    currency CHAR(3) DEFAULT 'INR',
    total_amount DECIMAL(10,2) NOT NULL, -- total = subtotal − discount + shipping
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    coupon_applied VARCHAR(50) DEFAULT NULL,
    shipping_charges DECIMAL(10,2) DEFAULT 0,
    paid_on TIMESTAMP NULL DEFAULT NULL,
    delivered_on TIMESTAMP DEFAULT NULL, -- will only be filled with the current time user receives the delivery and order_status is marked as delivered
    cancelled_on TIMESTAMP NULL DEFAULT NULL,
    order_source ENUM('web', 'mobile', 'admin') DEFAULT 'web',
    notes VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (users_address_id) REFERENCES user_address(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_orders (user_id),
    INDEX idx_order_status (order_status)
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id_fk INT NOT NULL,
    item_id VARCHAR(20) NOT NULL,
    item_variation_id VARCHAR(70) NOT NULL,
    item_type ENUM("skates_and_boots", "wheels", "helmets", "bearings", "accessories") NOT NULL,
    item_name VARCHAR(100) NOT NULL, -- snapshot
    item_image VARCHAR(255) DEFAULT NULL, -- snapshot
    quantity INT NOT NULL CHECK (quantity > 0),
    selling_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,   -- quantity * selling_price + customization if any
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id_fk) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX Idx_item_id (item_id),
    INDEX Idx_item_variation_id (item_variation_id),
    INDEX idx_order_items (order_id_fk)
);

CREATE TABLE order_item_customization (
    order_item_customization_id INT PRIMARY KEY AUTO_INCREMENT,
    order_item_id_fk INT NOT NULL,
    customization_type ENUM(
        'name_print',
        'color_strip',
        'text',
        'number',
        'custom_color'
    ) NOT NULL,
    customization_value VARCHAR(255) NOT NULL,
    is_custom_value BOOLEAN DEFAULT FALSE, 
    -- TRUE if user entered their own value (custom color, text, etc.)
    extra_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id_fk)
        REFERENCES order_item(order_item_id)
        ON DELETE CASCADE,
    INDEX idx_order_item_customization (order_item_id_fk)
);


CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_id VARCHAR(20) NOT NULL,
    item_variation_id VARCHAR(70) NOT NULL,
    item_type ENUM("skates_and_boots", "wheels", "helmets", "bearings", "accessories")  NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    is_custom BOOLEAN DEFAULT FALSE,
    currency CHAR(3) DEFAULT 'INR',
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_cart (user_id),
    INDEX idx_cart_user_lookup (user_id, item_type)
);

CREATE TABLE cart_item_customization (
    cart_item_customization_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_item_id_fk INT NOT NULL,
    customization_type ENUM(
        'name_print',
        'color_strip',
        'text',
        'number',
        'custom_color'
    ) NOT NULL,
    customization_value VARCHAR(255) NOT NULL,
    is_custom_value BOOLEAN DEFAULT FALSE, 
    -- TRUE if user entered their own value (custom color, text, etc.)
    extra_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_item_id_fk)
        REFERENCES cart(id)
        ON DELETE CASCADE,
    INDEX idx_cart_item_customization (cart_item_id_fk)
);

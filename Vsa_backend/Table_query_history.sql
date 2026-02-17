CREATE TABLE users_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT,
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  full_name VARCHAR(255),
  mobile VARCHAR(15),
  email VARCHAR(255),
  password VARCHAR(255),
  is_admin BOOLEAN,
  is_verified BOOLEAN,
  verification_token TEXT,
  reset_otp VARCHAR(10),
  otp_expiry TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  login_attempts INT,
  locked_until TIMESTAMP NULL,
  created_by VARCHAR(50),

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_history (
    user_id,
    action_type,
    full_name,
    mobile,
    email,
    password,
    is_admin,
    is_verified,
    verification_token,
    reset_otp,
    otp_expiry,
    last_login,
    login_attempts,
    locked_until,
    created_by
  )
  VALUES (
    NEW.id,
    'INSERT',
    NEW.full_name,
    NEW.mobile,
    NEW.email,
    NEW.password,
    NEW.is_admin,
    NEW.is_verified,
    NEW.verification_token,
    NEW.reset_otp,
    NEW.otp_expiry,
    NEW.last_login,
    NEW.login_attempts,
    NEW.locked_until,
    NEW.created_by
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER users_after_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_history (
    user_id,
    action_type,
    full_name,
    mobile,
    email,
    password,
    is_admin,
    is_verified,
    verification_token,
    reset_otp,
    otp_expiry,
    last_login,
    login_attempts,
    locked_until,
    created_by
  )
  VALUES (
    NEW.id,
    'UPDATE',
    NEW.full_name,
    NEW.mobile,
    NEW.email,
    NEW.password,
    NEW.is_admin,
    NEW.is_verified,
    NEW.verification_token,
    NEW.reset_otp,
    NEW.otp_expiry,
    NEW.last_login,
    NEW.login_attempts,
    NEW.locked_until,
    NEW.created_by
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER users_after_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_history (
    user_id,
    action_type,
    full_name,
    mobile,
    email,
    password,
    is_admin,
    is_verified,
    verification_token,
    reset_otp,
    otp_expiry,
    last_login,
    login_attempts,
    locked_until,
    created_by
  )
  VALUES (
    OLD.id,
    'DELETE',
    OLD.full_name,
    OLD.mobile,
    OLD.email,
    OLD.password,
    OLD.is_admin,
    OLD.is_verified,
    OLD.verification_token,
    OLD.reset_otp,
    OLD.otp_expiry,
    OLD.last_login,
    OLD.login_attempts,
    OLD.locked_until,
    OLD.created_by
  );
END$$

DELIMITER ;

CREATE TABLE user_address_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  address_id INT,
  user_id INT,
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),

  full_name VARCHAR(255),
  mobile VARCHAR(15),

  is_default BOOLEAN,
  is_gift BOOLEAN,

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER user_address_after_insert
AFTER INSERT ON user_address
FOR EACH ROW
BEGIN
  INSERT INTO user_address_history (
    address_id,
    user_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    full_name,
    mobile,
    is_default,
    is_gift
  )
  VALUES (
    NEW.id,
    NEW.user_id,
    'INSERT',
    NEW.address_line1,
    NEW.address_line2,
    NEW.city,
    NEW.state,
    NEW.postal_code,
    NEW.country,
    NEW.full_name,
    NEW.mobile,
    NEW.is_default,
    NEW.is_gift
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER user_address_after_update
AFTER UPDATE ON user_address
FOR EACH ROW
BEGIN
  INSERT INTO user_address_history (
    address_id,
    user_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    full_name,
    mobile,
    is_default,
    is_gift
  )
  VALUES (
    NEW.id,
    NEW.user_id,
    'UPDATE',
    NEW.address_line1,
    NEW.address_line2,
    NEW.city,
    NEW.state,
    NEW.postal_code,
    NEW.country,
    NEW.full_name,
    NEW.mobile,
    NEW.is_default,
    NEW.is_gift
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER user_address_after_delete
AFTER DELETE ON user_address
FOR EACH ROW
BEGIN
  INSERT INTO user_address_history (
    address_id,
    user_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    full_name,
    mobile,
    is_default,
    is_gift
  )
  VALUES (
    OLD.id,
    OLD.user_id,
    'DELETE',
    OLD.address_line1,
    OLD.address_line2,
    OLD.city,
    OLD.state,
    OLD.postal_code,
    OLD.country,
    OLD.full_name,
    OLD.mobile,
    OLD.is_default,
    OLD.is_gift
  );
END$$

DELIMITER ;

CREATE TABLE admin_access_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  admin_access_id INT,
  user_id INT,
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  show_order_status BOOLEAN,
  show_edit_shop BOOLEAN,
  show_edit_achievements BOOLEAN,
  show_invoice_generation BOOLEAN,
  show_online_sales BOOLEAN,
  show_offline_customers BOOLEAN,
  show_online_users BOOLEAN,
  show_available_stocks BOOLEAN,
  show_offline_sales BOOLEAN,
  show_send_mails BOOLEAN,
  show_new_student BOOLEAN,
  show_attendance BOOLEAN,
  show_manage_students BOOLEAN,
  show_students_achievements BOOLEAN,
  show_attendance_records BOOLEAN,
  show_news_letter BOOLEAN,
  show_manage_admins BOOLEAN,
  show_manage_dashboard BOOLEAN,
  show_manage_policy BOOLEAN,
  show_manage_disciplines BOOLEAN,

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER admin_access_after_insert
AFTER INSERT ON admin_access
FOR EACH ROW
BEGIN
  INSERT INTO admin_access_history (
    admin_access_id,
    user_id,
    action_type,
    show_order_status,
    show_edit_shop,
    show_edit_achievements,
    show_invoice_generation,
    show_online_sales,
    show_offline_customers,
    show_online_users,
    show_available_stocks,
    show_offline_sales,
    show_send_mails,
    show_new_student,
    show_attendance,
    show_manage_students,
    show_students_achievements,
    show_attendance_records,
    show_news_letter,
    show_manage_admins,
    show_manage_dashboard,
    show_manage_policy,
    show_manage_disciplines
  )
  VALUES (
    NEW.id,
    NEW.user_id,
    'INSERT',
    NEW.show_order_status,
    NEW.show_edit_shop,
    NEW.show_edit_achievements,
    NEW.show_invoice_generation,
    NEW.show_online_sales,
    NEW.show_offline_customers,
    NEW.show_online_users,
    NEW.show_available_stocks,
    NEW.show_offline_sales,
    NEW.show_send_mails,
    NEW.show_new_student,
    NEW.show_attendance,
    NEW.show_manage_students,
    NEW.show_students_achievements,
    NEW.show_attendance_records,
    NEW.show_news_letter,
    NEW.show_manage_admins,
    NEW.show_manage_dashboard,
    NEW.show_manage_policy,
    NEW.show_manage_disciplines
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER admin_access_after_update
AFTER UPDATE ON admin_access
FOR EACH ROW
BEGIN
  INSERT INTO admin_access_history (
    admin_access_id,
    user_id,
    action_type,
    show_order_status,
    show_edit_shop,
    show_edit_achievements,
    show_invoice_generation,
    show_online_sales,
    show_offline_customers,
    show_online_users,
    show_available_stocks,
    show_offline_sales,
    show_send_mails,
    show_new_student,
    show_attendance,
    show_manage_students,
    show_students_achievements,
    show_attendance_records,
    show_news_letter,
    show_manage_admins,
    show_manage_dashboard,
    show_manage_policy,
    show_manage_disciplines
  )
  VALUES (
    NEW.id,
    NEW.user_id,
    'UPDATE',
    NEW.show_order_status,
    NEW.show_edit_shop,
    NEW.show_edit_achievements,
    NEW.show_invoice_generation,
    NEW.show_online_sales,
    NEW.show_offline_customers,
    NEW.show_online_users,
    NEW.show_available_stocks,
    NEW.show_offline_sales,
    NEW.show_send_mails,
    NEW.show_new_student,
    NEW.show_attendance,
    NEW.show_manage_students,
    NEW.show_students_achievements,
    NEW.show_attendance_records,
    NEW.show_news_letter,
    NEW.show_manage_admins,
    NEW.show_manage_dashboard,
    NEW.show_manage_policy,
    NEW.show_manage_disciplines
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER admin_access_after_delete
AFTER DELETE ON admin_access
FOR EACH ROW
BEGIN
  INSERT INTO admin_access_history (
    admin_access_id,
    user_id,
    action_type,
    show_order_status,
    show_edit_shop,
    show_edit_achievements,
    show_invoice_generation,
    show_online_sales,
    show_offline_customers,
    show_online_users,
    show_available_stocks,
    show_offline_sales,
    show_send_mails,
    show_new_student,
    show_attendance,
    show_manage_students,
    show_students_achievements,
    show_attendance_records,
    show_news_letter,
    show_manage_admins,
    show_manage_dashboard,
    show_manage_policy,
    show_manage_disciplines
  )
  VALUES (
    OLD.id,
    OLD.user_id,
    'DELETE',
    OLD.show_order_status,
    OLD.show_edit_shop,
    OLD.show_edit_achievements,
    OLD.show_invoice_generation,
    OLD.show_online_sales,
    OLD.show_offline_customers,
    OLD.show_online_users,
    OLD.show_available_stocks,
    OLD.show_offline_sales,
    OLD.show_send_mails,
    OLD.show_new_student,
    OLD.show_attendance,
    OLD.show_manage_students,
    OLD.show_students_achievements,
    OLD.show_attendance_records,
    OLD.show_news_letter,
    OLD.show_manage_admins,
    OLD.show_manage_dashboard,
    OLD.show_manage_policy,
    OLD.show_manage_disciplines
  );
END$$

DELIMITER ;

CREATE TABLE students_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  student_pk_id INT,
  student_id VARCHAR(30),
  users_user_id INT,

  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  img VARCHAR(255),
  full_name VARCHAR(255),
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  email VARCHAR(255),
  mobile_number VARCHAR(13),
  whatsapp_number VARCHAR(13),
  dob DATE,
  class VARCHAR(10),
  gender VARCHAR(10),
  school_name VARCHAR(200),
  hobbies VARCHAR(100),
  date_of_joining TIMESTAMP,
  student_group VARCHAR(20),
  skate_type VARCHAR(20),
  fee_structure INT,
  fee_cycle ENUM('monthly', 'quarterly', 'half-yearly', 'yearly'),
  next_payment_date DATE,
  pending_fee INT,
  transportation BOOLEAN,
  status ENUM('active', 'passive'),

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER students_after_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
  INSERT INTO students_history (
    student_pk_id,
    student_id,
    users_user_id,
    action_type,
    img,
    full_name,
    father_name,
    mother_name,
    email,
    mobile_number,
    whatsapp_number,
    dob,
    class,
    gender,
    school_name,
    hobbies,
    date_of_joining,
    student_group,
    skate_type,
    fee_structure,
    fee_cycle,
    next_payment_date,
    pending_fee,
    transportation,
    status
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    NEW.users_user_id,
    'INSERT',
    NEW.img,
    NEW.full_name,
    NEW.father_name,
    NEW.mother_name,
    NEW.email,
    NEW.mobile_number,
    NEW.whatsapp_number,
    NEW.dob,
    NEW.class,
    NEW.gender,
    NEW.school_name,
    NEW.hobbies,
    NEW.date_of_joining,
    NEW.student_group,
    NEW.skate_type,
    NEW.fee_structure,
    NEW.fee_cycle,
    NEW.next_payment_date,
    NEW.pending_fee,
    NEW.transportation,
    NEW.status
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER students_after_update
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
  INSERT INTO students_history (
    student_pk_id,
    student_id,
    users_user_id,
    action_type,
    img,
    full_name,
    father_name,
    mother_name,
    email,
    mobile_number,
    whatsapp_number,
    dob,
    class,
    gender,
    school_name,
    hobbies,
    date_of_joining,
    student_group,
    skate_type,
    fee_structure,
    fee_cycle,
    next_payment_date,
    pending_fee,
    transportation,
    status
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    NEW.users_user_id,
    'UPDATE',
    NEW.img,
    NEW.full_name,
    NEW.father_name,
    NEW.mother_name,
    NEW.email,
    NEW.mobile_number,
    NEW.whatsapp_number,
    NEW.dob,
    NEW.class,
    NEW.gender,
    NEW.school_name,
    NEW.hobbies,
    NEW.date_of_joining,
    NEW.student_group,
    NEW.skate_type,
    NEW.fee_structure,
    NEW.fee_cycle,
    NEW.next_payment_date,
    NEW.pending_fee,
    NEW.transportation,
    NEW.status
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER students_after_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN
  INSERT INTO students_history (
    student_pk_id,
    student_id,
    users_user_id,
    action_type,
    img,
    full_name,
    father_name,
    mother_name,
    email,
    mobile_number,
    whatsapp_number,
    dob,
    class,
    gender,
    school_name,
    hobbies,
    date_of_joining,
    student_group,
    skate_type,
    fee_structure,
    fee_cycle,
    next_payment_date,
    pending_fee,
    transportation,
    status
  )
  VALUES (
    OLD.id,
    OLD.student_id,
    OLD.users_user_id,
    'DELETE',
    OLD.img,
    OLD.full_name,
    OLD.father_name,
    OLD.mother_name,
    OLD.email,
    OLD.mobile_number,
    OLD.whatsapp_number,
    OLD.dob,
    OLD.class,
    OLD.gender,
    OLD.school_name,
    OLD.hobbies,
    OLD.date_of_joining,
    OLD.student_group,
    OLD.skate_type,
    OLD.fee_structure,
    OLD.fee_cycle,
    OLD.next_payment_date,
    OLD.pending_fee,
    OLD.transportation,
    OLD.status
  );
END$$

DELIMITER ;

CREATE TABLE student_address_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  address_id INT,
  student_id VARCHAR(30),
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER student_address_after_insert
AFTER INSERT ON student_address
FOR EACH ROW
BEGIN
  INSERT INTO student_address_history (
    address_id,
    student_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'INSERT',
    NEW.address_line1,
    NEW.address_line2,
    NEW.city,
    NEW.state,
    NEW.postal_code,
    NEW.country
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER student_address_after_delete
AFTER DELETE ON student_address
FOR EACH ROW
BEGIN
  INSERT INTO student_address_history (
    address_id,
    student_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country
  )
  VALUES (
    OLD.id,
    OLD.student_id,
    'DELETE',
    OLD.address_line1,
    OLD.address_line2,
    OLD.city,
    OLD.state,
    OLD.postal_code,
    OLD.country
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER student_address_after_update
AFTER UPDATE ON student_address
FOR EACH ROW
BEGIN
  INSERT INTO student_address_history (
    address_id,
    student_id,
    action_type,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'UPDATE',
    NEW.address_line1,
    NEW.address_line2,
    NEW.city,
    NEW.state,
    NEW.postal_code,
    NEW.country
  );
END$$

DELIMITER ;


CREATE TABLE student_fee_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  fee_id INT,
  student_id VARCHAR(30),
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  transaction_id VARCHAR(100),
  amount_paid DECIMAL(10,2),
  remarks TEXT,
  payment_mode ENUM('admin_manual','cash','upi','card','bank'),
  status ENUM('success','failed','pending'),
  payment_date DATE,

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER student_fee_after_insert
AFTER INSERT ON student_fee
FOR EACH ROW
BEGIN
  INSERT INTO student_fee_history (
    fee_id,
    student_id,
    action_type,
    transaction_id,
    amount_paid,
    remarks,
    payment_mode,
    status,
    payment_date
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'INSERT',
    NEW.transaction_id,
    NEW.amount_paid,
    NEW.remarks,
    NEW.payment_mode,
    NEW.status,
    NEW.payment_date
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER student_fee_after_update
AFTER UPDATE ON student_fee
FOR EACH ROW
BEGIN
  INSERT INTO student_fee_history (
    fee_id,
    student_id,
    action_type,
    transaction_id,
    amount_paid,
    remarks,
    payment_mode,
    status,
    payment_date
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'UPDATE',
    NEW.transaction_id,
    NEW.amount_paid,
    NEW.remarks,
    NEW.payment_mode,
    NEW.status,
    NEW.payment_date
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER student_fee_after_delete
AFTER DELETE ON student_fee
FOR EACH ROW
BEGIN
  INSERT INTO student_fee_history (
    fee_id,
    student_id,
    action_type,
    transaction_id,
    amount_paid,
    remarks,
    payment_mode,
    status,
    payment_date
  )
  VALUES (
    OLD.id,
    OLD.student_id,
    'DELETE',
    OLD.transaction_id,
    OLD.amount_paid,
    OLD.remarks,
    OLD.payment_mode,
    OLD.status,
    OLD.payment_date
  );
END$$

DELIMITER ;

CREATE TABLE students_attendance_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,

  attendance_id INT,
  student_id VARCHAR(30),
  action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,

  status ENUM('Present', 'Absent', 'Sick'),
  attendance_date DATE,
  marked_by VARCHAR(70),

  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER students_attendance_after_insert
AFTER INSERT ON students_attendance
FOR EACH ROW
BEGIN
  INSERT INTO students_attendance_history (
    attendance_id,
    student_id,
    action_type,
    status,
    attendance_date,
    marked_by
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'INSERT',
    NEW.status,
    NEW.attendance_date,
    NEW.marked_by
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER students_attendance_after_update
AFTER UPDATE ON students_attendance
FOR EACH ROW
BEGIN
  INSERT INTO students_attendance_history (
    attendance_id,
    student_id,
    action_type,
    status,
    attendance_date,
    marked_by
  )
  VALUES (
    NEW.id,
    NEW.student_id,
    'UPDATE',
    NEW.status,
    NEW.attendance_date,
    NEW.marked_by
  );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER students_attendance_after_delete
AFTER DELETE ON students_attendance
FOR EACH ROW
BEGIN
  INSERT INTO students_attendance_history (
    attendance_id,
    student_id,
    action_type,
    status,
    attendance_date,
    marked_by
  )
  VALUES (
    OLD.id,
    OLD.student_id,
    'DELETE',
    OLD.status,
    OLD.attendance_date,
    OLD.marked_by
  );
END$$

DELIMITER ;

-- History tables related to shop
CREATE TABLE orders_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,

    order_pk INT NOT NULL, -- orders.id
    order_id VARCHAR(40),

    user_id INT,
    users_address_id INT,

    order_status ENUM(
        'pending','payment_pending','paid','confirmed',
        'shipped','delivered','cancelled','refunded'
    ),

    payment_status ENUM(
        'created','authorized','captured','failed','refunded'
    ),

    payment_method VARCHAR(50),
    currency CHAR(3),

    total_amount DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    discount DECIMAL(10,2),
    coupon_applied VARCHAR(50),
    shipping_charges DECIMAL(10,2),

    paid_on TIMESTAMP NULL,
    delivered_on TIMESTAMP NULL,
    cancelled_on TIMESTAMP NULL,

    order_source ENUM('web','mobile','admin'),
    notes VARCHAR(255),

    action_type ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER orders_ai
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO orders_history (
        order_pk, order_id, user_id, users_address_id,
        order_status, payment_status, payment_method, currency,
        total_amount, subtotal, discount, coupon_applied,
        shipping_charges, paid_on, delivered_on, cancelled_on,
        order_source, notes, action_type
    ) VALUES (
        NEW.id, NEW.order_id, NEW.user_id, NEW.users_address_id,
        NEW.order_status, NEW.payment_status, NEW.payment_method, NEW.currency,
        NEW.total_amount, NEW.subtotal, NEW.discount, NEW.coupon_applied,
        NEW.shipping_charges, NEW.paid_on, NEW.delivered_on, NEW.cancelled_on,
        NEW.order_source, NEW.notes, 'INSERT'
    );
END$$

CREATE TRIGGER orders_au
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO orders_history (
        order_pk, order_id, user_id, users_address_id,
        order_status, payment_status, payment_method, currency,
        total_amount, subtotal, discount, coupon_applied,
        shipping_charges, paid_on, delivered_on, cancelled_on,
        order_source, notes, action_type
    ) VALUES (
        NEW.id, NEW.order_id, NEW.user_id, NEW.users_address_id,
        NEW.order_status, NEW.payment_status, NEW.payment_method, NEW.currency,
        NEW.total_amount, NEW.subtotal, NEW.discount, NEW.coupon_applied,
        NEW.shipping_charges, NEW.paid_on, NEW.delivered_on, NEW.cancelled_on,
        NEW.order_source, NEW.notes, 'UPDATE'
    );
END$$

CREATE TRIGGER orders_ad
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO orders_history (
        order_pk, order_id, user_id, users_address_id,
        order_status, payment_status, payment_method, currency,
        total_amount, subtotal, discount, coupon_applied,
        shipping_charges, paid_on, delivered_on, cancelled_on,
        order_source, notes, action_type
    ) VALUES (
        OLD.id, OLD.order_id, OLD.user_id, OLD.users_address_id,
        OLD.order_status, OLD.payment_status, OLD.payment_method, OLD.currency,
        OLD.total_amount, OLD.subtotal, OLD.discount, OLD.coupon_applied,
        OLD.shipping_charges, OLD.paid_on, OLD.delivered_on, OLD.cancelled_on,
        OLD.order_source, OLD.notes, 'DELETE'
    );
END$$

DELIMITER ;


CREATE TABLE order_item_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,

    order_item_pk INT NOT NULL,
    order_id_fk INT,

    item_id VARCHAR(20),
    item_variation_id VARCHAR(70),
    item_type ENUM(
        'skates_and_boots','wheels','helmets','bearings','accessories'
    ),

    item_name VARCHAR(100),
    item_image VARCHAR(255),

    quantity INT,
    selling_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    is_custom BOOLEAN,

    action_type ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER order_item_ai
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
    INSERT INTO order_item_history (
        order_item_pk, order_id_fk, item_id, item_variation_id,
        item_type, item_name, item_image,
        quantity, selling_price, total_price, is_custom,
        action_type
    ) VALUES (
        NEW.order_item_id, NEW.order_id_fk, NEW.item_id, NEW.item_variation_id,
        NEW.item_type, NEW.item_name, NEW.item_image,
        NEW.quantity, NEW.selling_price, NEW.total_price, NEW.is_custom,
        'INSERT'
    );
END$$

CREATE TRIGGER order_item_au
AFTER UPDATE ON order_item
FOR EACH ROW
BEGIN
    INSERT INTO order_item_history (
        order_item_pk, order_id_fk, item_id, item_variation_id,
        item_type, item_name, item_image,
        quantity, selling_price, total_price, is_custom,
        action_type
    ) VALUES (
        NEW.order_item_id, NEW.order_id_fk, NEW.item_id, NEW.item_variation_id,
        NEW.item_type, NEW.item_name, NEW.item_image,
        NEW.quantity, NEW.selling_price, NEW.total_price, NEW.is_custom,
        'UPDATE'
    );
END$$

CREATE TRIGGER order_item_ad
AFTER DELETE ON order_item
FOR EACH ROW
BEGIN
    INSERT INTO order_item_history (
        order_item_pk, order_id_fk, item_id, item_variation_id,
        item_type, item_name, item_image,
        quantity, selling_price, total_price, is_custom,
        action_type
    ) VALUES (
        OLD.order_item_id, OLD.order_id_fk, OLD.item_id, OLD.item_variation_id,
        OLD.item_type, OLD.item_name, OLD.item_image,
        OLD.quantity, OLD.selling_price, OLD.total_price, OLD.is_custom,
        'DELETE'
    );
END$$

DELIMITER ;


CREATE TABLE order_item_customization_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,

    customization_pk INT NOT NULL,
    order_item_id_fk INT,

    customization_type ENUM(
        'name_print','color_strip','text','number','custom_color'
    ),

    customization_value VARCHAR(255),
    is_custom_value BOOLEAN,
    extra_price DECIMAL(10,2),

    action_type ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER order_item_customization_ai
AFTER INSERT ON order_item_customization
FOR EACH ROW
BEGIN
    INSERT INTO order_item_customization_history (
        customization_pk, order_item_id_fk,
        customization_type, customization_value,
        is_custom_value, extra_price,
        action_type
    ) VALUES (
        NEW.order_item_customization_id, NEW.order_item_id_fk,
        NEW.customization_type, NEW.customization_value,
        NEW.is_custom_value, NEW.extra_price,
        'INSERT'
    );
END$$

CREATE TRIGGER order_item_customization_au
AFTER UPDATE ON order_item_customization
FOR EACH ROW
BEGIN
    INSERT INTO order_item_customization_history (
        customization_pk, order_item_id_fk,
        customization_type, customization_value,
        is_custom_value, extra_price,
        action_type
    ) VALUES (
        NEW.order_item_customization_id, NEW.order_item_id_fk,
        NEW.customization_type, NEW.customization_value,
        NEW.is_custom_value, NEW.extra_price,
        'UPDATE'
    );
END$$

CREATE TRIGGER order_item_customization_ad
AFTER DELETE ON order_item_customization
FOR EACH ROW
BEGIN
    INSERT INTO order_item_customization_history (
        customization_pk, order_item_id_fk,
        customization_type, customization_value,
        is_custom_value, extra_price,
        action_type
    ) VALUES (
        OLD.order_item_customization_id, OLD.order_item_id_fk,
        OLD.customization_type, OLD.customization_value,
        OLD.is_custom_value, OLD.extra_price,
        'DELETE'
    );
END$$

DELIMITER ;


CREATE TABLE item_sold_offline_history (
  history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  original_id INT,
  invoice_number VARCHAR(30),
  full_name VARCHAR(255),
  mobile VARCHAR(15),
  whatsapp_number VARCHAR(15),
  email VARCHAR(255),
  amount_paid DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  discount_applied DECIMAL(10,2),
  pending_amount DECIMAL(10,2),
  payment_type ENUM ('Cash', 'UPI', 'Credit Card', 'Debit Card', 'Others', 'Mixed'),
  is_deleted BOOLEAN,
  deleted_at TIMESTAMP NULL,
  status ENUM('ACTIVE','DELETED','ADJUSTED','PARTIAL_RETURN','FULL_RETURN'),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,

  operation_type ENUM('INSERT','UPDATE','DELETE'),
  operation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  operated_by VARCHAR(100) NULL
);


DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_ai
AFTER INSERT ON item_sold_offline
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_history (
    original_id, invoice_number, full_name, mobile, whatsapp_number, email,
    amount_paid, total_amount, discount_applied, pending_amount,
    payment_type, is_deleted, deleted_at, status,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    NEW.id, NEW.invoice_number, NEW.full_name, NEW.mobile, NEW.whatsapp_number, NEW.email,
    NEW.amount_paid, NEW.total_amount, NEW.discount_applied, NEW.pending_amount,
    NEW.payment_type, NEW.is_deleted, NEW.deleted_at, NEW.status,
    NEW.created_at, NEW.updated_at,
    'INSERT'
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_au
AFTER UPDATE ON item_sold_offline
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_history (
    original_id, invoice_number, full_name, mobile, whatsapp_number, email,
    amount_paid, total_amount, discount_applied, pending_amount,
    payment_type, is_deleted, deleted_at, status,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    NEW.id, NEW.invoice_number, NEW.full_name, NEW.mobile, NEW.whatsapp_number, NEW.email,
    NEW.amount_paid, NEW.total_amount, NEW.discount_applied, NEW.pending_amount,
    NEW.payment_type, NEW.is_deleted, NEW.deleted_at, NEW.status,
    NEW.created_at, NEW.updated_at,
    'UPDATE'
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_ad
AFTER DELETE ON item_sold_offline
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_history (
    original_id, invoice_number, full_name, mobile, whatsapp_number, email,
    amount_paid, total_amount, discount_applied, pending_amount,
    payment_type, is_deleted, deleted_at, status,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    OLD.id, OLD.invoice_number, OLD.full_name, OLD.mobile, OLD.whatsapp_number, OLD.email,
    OLD.amount_paid, OLD.total_amount, OLD.discount_applied, OLD.pending_amount,
    OLD.payment_type, OLD.is_deleted, OLD.deleted_at, OLD.status,
    OLD.created_at, OLD.updated_at,
    'DELETE'
  );
END$$

DELIMITER ;


CREATE TABLE item_sold_offline_items_history (
  history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  original_id INT,
  item_sold_offline_id INT,
  item_id VARCHAR(20),
  item_type ENUM("skates_and_boots", "wheels", "bearings", "helmets", "accessories"),
  item_variation_id VARCHAR(100),
  quantity INT,
  price_at_sale DECIMAL(10,2),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  change_type ENUM('INSERT','UPDATE','DELETE'),
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  operated_by VARCHAR(100) NULL
);

DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_items_ai
AFTER INSERT ON item_sold_offline_items
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_items_history (
    original_id, item_sold_offline_id, item_id, item_type,
    item_variation_id, quantity, price_at_sale,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    NEW.id, NEW.item_sold_offline_id, NEW.item_id, NEW.item_type,
    NEW.item_variation_id, NEW.quantity, NEW.price_at_sale,
    NEW.created_at, NEW.updated_at,
    'INSERT'
  );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_items_au
AFTER UPDATE ON item_sold_offline_items
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_items_history (
    original_id, item_sold_offline_id, item_id, item_type,
    item_variation_id, quantity, price_at_sale,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    NEW.id, NEW.item_sold_offline_id, NEW.item_id, NEW.item_type,
    NEW.item_variation_id, NEW.quantity, NEW.price_at_sale,
    NEW.created_at, NEW.updated_at,
    'UPDATE'
  );
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER trg_item_sold_offline_items_ad
AFTER DELETE ON item_sold_offline_items
FOR EACH ROW
BEGIN
  INSERT INTO item_sold_offline_items_history (
    original_id, item_sold_offline_id, item_id, item_type,
    item_variation_id, quantity, price_at_sale,
    created_at, updated_at,
    operation_type
  )
  VALUES (
    OLD.id, OLD.item_sold_offline_id, OLD.item_id, OLD.item_type,
    OLD.item_variation_id, OLD.quantity, OLD.price_at_sale,
    OLD.created_at, OLD.updated_at,
    'DELETE'
  );
END$$

DELIMITER ;

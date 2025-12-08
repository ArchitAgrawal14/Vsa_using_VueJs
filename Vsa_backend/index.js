import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as middlewares from "./middlewares/middleware.js";
import "./middlewares/passportConfig.js";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import * as admin from "./admin.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL_VALIDATOR_EMAIL,
    pass: process.env.NODE_MAILER_EMAIL_VALIDATOR_PASSWORD,
  },
});

app.post(
  "/vsa/signup",
  middlewares.validateSignup,
  middlewares.handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, fullName, mobile, confirmPassword } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^(\+?\d{1,4}[-\s]?)?\d{6,14}$/;
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;

      console.log(`email: ${email}
      password: ${password}
      fullName: ${fullName}
      mobile: ${mobile}`);

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      if (!mobileRegex.test(mobile)) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid mobile number. Use format like "+1234567890" or "1234567890" with 6–14 digits.',
        });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters long and contain both letters and numbers.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and Confirm password field should be same.",
        });
      }

      const [userDuplicacyCheck] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (userDuplicacyCheck.length > 0) {
        const user = userDuplicacyCheck[0];
        console.log(
          "User already exist",
          user.email,
          user.password,
          user.full_name,
          user.mobile
        );
        return res.status(400).json({
          success: false,
          message: "User already exists with this email, login to continue",
        });
      }

      const saltRounds = 12;
      const userId = uuidv4();
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const firstName = fullName.split(" ")[0];

      await db.query(
        "INSERT INTO users (user_id, full_name, mobile, email, password) VALUES (?, ?, ?, ?, ?)",
        [userId, fullName, mobile, email, hashedPassword]
      );

      verifyUserEmail(email);

      return res.status(201).json({
        success: true,
        message:
          "Account created successfully! We have sent a verification link click and login to continue.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }
);

app.post(
  "/vsa/login",
  middlewares.validateLogin,
  middlewares.handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, captcha } = req.body;

      if (email == null || password == null || captcha == null) {
        return res.status(401).json({
          success: false,
          message: "Fields cannot be empty, Please fill in valid values",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const [userCheck] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (userCheck.length > 0) {
        const user = userCheck[0];

        if (user.is_verified !== 1) {
          verifyUserEmail(email);
          return res.status(400).json({
            success: false,
            message:
              "User is not verified, Check email and click the verification link",
          });
        }

        if (user.is_admin === 1) {
          return await isUserAdmin(password, user, true, res);
        } else {
          return await isUserAdmin(password, user, false, res);
        }
      } else {
        await db.query(
          "INSERT INTO login_logs (user_id, email, success, failure_reason) VALUES (?, ?, ?, ?)",
          [user?.id || null, email, false, "User does not exists"]
        );

        return res.status(401).json({
          success: false,
          message:
            "User does not exist , Please Sign up to continue your journey",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      await db.query(
        "INSERT INTO login_logs (user_id, email, success, failure_reason) VALUES (?, ?, ?, ?)",
        [user?.id || null, email, false, "Internal server error"]
      );
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }
);

async function verifyUserEmail(email) {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const [userCheck] = await db.query("SELECT * FROM users WHERE email=?", [
    email,
  ]);

  if (userCheck.length > 0) {
    const user = userCheck[0];
    await db.query("UPDATE users SET verification_token = ? WHERE email = ?", [
      verificationToken,
      user.email,
    ]);
  }

  const verificationLink = `http://localhost:3000/vsa/verify-email?token=${verificationToken}`;
  // const verificationLink = `https://vaibhavskatingacademy.com/vsa/verify-email?token=${verificationToken}`;

  const firstName = userCheck[0].full_name.split(" ")[0];
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL_VALIDATOR_EMAIL,
    to: email,
    subject: "Verify your email for sign-up",
    html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #3498db; text-align: center;">Welcome, ${firstName}!</h2>
            <p style="font-size: 16px; color: #333333; text-align: center;">Thank you for signing up. Please verify your email address to complete your registration.</p>
            <p style="font-size: 16px; color: #333333; text-align: center;">To verify your email, please click the button below:</p>
            <div style="text-align: center; margin: 20px;">
                <a href="${verificationLink}" style="background-color: #3498db; color: #ffffff; padding: 12px 30px; text-decoration: none; font-size: 16px; border-radius: 5px; box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2);">Verify Email</a>
            </div>
            <p style="font-size: 14px; color: #777777; text-align: center;">If you did not sign up, please ignore this email.</p>
            <footer style="font-size: 12px; color: #aaaaaa; text-align: center; margin-top: 30px;">
                <p>Best regards,</p>
                <p>Your Company Team</p>
            </footer>
        </div>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
}

async function isUserAdmin(password, user, isAdmin, res) {
  const passwordValidation = await bcrypt.compare(password, user.password);

  if (!passwordValidation) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

  let adminPermissions = null;
  if (isAdmin) {
    const [permissionResults] = await db.query(
      "SELECT * FROM admin_access where user_id = ?",
      [user.user_id]
    );
    if (permissionResults.length > 0) {
      adminPermissions = permissionResults[0];
    } else {
      await db.query(
        `
            INSERT INTO admin_access (
              user_id, show_order_status, show_edit_shop, show_edit_achievements,
              show_invoice_generation, show_online_sales, show_offline_customers,
              show_online_users, show_available_stocks, show_offline_sales,
              show_send_mails, show_new_student, show_attendance, show_manage_students,
              show_students_achievements, show_attendance_records, show_news_letter,
              show_manage_admins, show_manage_dashboard
            ) VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
          `,
        [user.user_id]
      );
      adminPermissions = {
        show_order_status: false,
        show_edit_shop: false,
        show_edit_achievements: false,
        show_invoice_generation: false,
        show_online_sales: false,
        show_offline_customers: false,
        show_online_users: false,
        show_available_stocks: false,
        show_offline_sales: false,
        show_send_mails: false,
        show_new_student: false,
        show_attendance: false,
        show_manage_students: false,
        show_students_achievements: false,
        show_attendance_records: false,
        show_news_letter: false,
        show_manage_admins: false,
      };
    }
  }
  console.log("JWT in isUserAdmin " + JWT_SECRET);
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isAdmin: isAdmin,
      firstName: user.full_name.split(" ")[0],
      permissions: adminPermissions,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  await db.query(
    "INSERT INTO login_logs (user_id, email, success) VALUES (?, ?, ?)",
    [user?.id || null, user.email, true]
  );

  res.json({
    success: true,
    message: "Login successful , Welcome back",
    data: {
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        isAdmin: isAdmin,
        mobile: user.mobile,
        permissions: adminPermissions,
      },
    },
  });
}

app.post("/vsa/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const [userCheck] = await db.query("SELECT * FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    if (userCheck.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = userCheck[0];
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin === 1,
        firstName: user.full_name.split(" ")[0],
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// Email verification route - after user clicks the link in their email
app.get("/vsa/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const [users] = await db.query(
      `SELECT * FROM users WHERE verification_token = ?`,
      [token]
    );

    if (users.length === 0) {
      // No user found with the token
      return res.redirect(
        `${
          process.env.BASE_URL
        }/login?verified=error&message=${encodeURIComponent(
          "Email verification failed. Invalid or expired token."
        )}`
      );
    }

    const user = users[0];

    if (user.is_verified) {
      // User already verified
      return res.redirect(
        `${
          process.env.BASE_URL
        }/login?verified=info&message=${encodeURIComponent(
          "Your email is already verified. Please log in."
        )}`
      );
    }

    // User found and not verified – verify now
    await db.query(
      `UPDATE users SET is_verified = TRUE WHERE verification_token = ?`,
      [token]
    );

    return res.redirect(
      `${
        process.env.BASE_URL
      }/login?verified=success&message=${encodeURIComponent(
        "Your email has been verified successfully! You can now log in."
      )}`
    );
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.redirect(
      `${
        process.env.BASE_URL
      }/login?verified=error&message=${encodeURIComponent(
        "Email verification failed. Please try again."
      )}`
    );
  }
});

app.get(
  "/vsa/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      // For Vue.js, we'll redirect to a special page that handles the token
      const { token, refreshToken, user } = req.user;

      // Create a temporary token for the frontend to retrieve
      const tempToken = jwt.sign(
        {
          token,
          refreshToken,
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            isAdmin: user.is_admin === 0,
            mobile: user.mobile || "",
          },
        },
        JWT_SECRET,
        { expiresIn: "5m" }
      ); // Short-lived token for data transfer

      // Redirect to Vue.js frontend with the temporary token
      res.redirect(
        `http://localhost:8080/auth/google/success?token=${tempToken}`
      );
    } catch (error) {
      console.error("Callback error:", error);
      res.redirect("/login?error=callback_failed");
    }
  }
);

// API endpoint to exchange temporary token for actual auth data
app.post("/vsa/google-auth-exchange", async (req, res) => {
  try {
    const { tempToken } = req.body;

    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: "Temporary token is required",
      });
    }

    // Verify and decode the temporary token
    const decoded = jwt.verify(tempToken, JWT_SECRET);

    res.json({
      success: true,
      message: "Google Sign-In successful! Welcome back",
      data: {
        token: decoded.token,
        refreshToken: decoded.refreshToken,
        user: decoded.user,
      },
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

const staticContentConfig = {
  faq: {
    table: "faqs",
    orderBy: "id",
    errorMessage: "Failed to fetch FAQs",
    useWrappedResponse: false,
  },
  "privacy-policy": {
    table: "privacy_policies",
    orderBy: "id",
    errorMessage: "Failed to fetch privacy policy",
    useWrappedResponse: false,
  },
  "refund-policy": {
    table: "refund_policies",
    orderBy: "id",
    errorMessage: "Failed to fetch refund policy",
    useWrappedResponse: false,
  },
  "return-policy": {
    table: "return_policies",
    orderBy: "step_number",
    errorMessage: "Failed to fetch return policy",
    useWrappedResponse: false,
  },
  "shipping-policy": {
    table: "shipping_policies",
    orderBy: "id",
    errorMessage: "Failed to fetch shipping policy",
    useWrappedResponse: false,
  },
  "terms-conditions": {
    table: "terms_and_conditions",
    orderBy: "id",
    errorMessage: "Failed to fetch terms and conditions",
    useWrappedResponse: false,
  },
  "cancellation-refunds": {
    table: "cancellation_refunds",
    orderBy: "id",
    errorMessage: "Server error",
    useWrappedResponse: true,
  },
};

// Endpoint to fetch all the data for user dashboard and also used in manage dashboard for admin page
app.get("/vsa/dashboard", async (req, res) => {
  try {
    // Optimized query to get latest stats by display_order (1-4 only)
    const [statsData] = await db.query(`
      SELECT s1.* FROM dashboard_stats_data s1
      INNER JOIN (
        SELECT display_order, MAX(id) as max_id
        FROM dashboard_stats_data
        WHERE display_order BETWEEN 1 AND 4
        GROUP BY display_order
      ) s2 ON s1.display_order = s2.display_order AND s1.id = s2.max_id
      ORDER BY s1.display_order ASC
    `);

    // Optimized query to get latest programs by display_order
    const [programsData] = await db.query(`
      SELECT p1.* FROM dashboard_programs_data p1
      INNER JOIN (
        SELECT display_order, MAX(id) as max_id
        FROM dashboard_programs_data
        GROUP BY display_order
      ) p2 ON p1.display_order = p2.display_order AND p1.id = p2.max_id
      ORDER BY p1.display_order ASC
    `);

    // Optimized query to get latest coaches by display_order
    const [coachesData] = await db.query(`
      SELECT c1.* FROM dashboard_coaches_data c1
      INNER JOIN (
        SELECT display_order, MAX(id) as max_id
        FROM dashboard_coaches_data
        GROUP BY display_order
      ) c2 ON c1.display_order = c2.display_order AND c1.id = c2.max_id
      ORDER BY c1.display_order ASC
    `);

    // Optimized query to get latest achievements by display_order
    const [achievementsData] = await db.query(`
      SELECT a1.* FROM dashboard_achievements_data a1
      INNER JOIN (
        SELECT display_order, MAX(id) as max_id
        FROM dashboard_achievements_data
        GROUP BY display_order
      ) a2 ON a1.display_order = a2.display_order AND a1.id = a2.max_id
      ORDER BY a1.display_order ASC
    `);

    // Get featured records (latest 10)
    const [recordsData] = await db.query(`
      SELECT * FROM dashboard_records_data 
      WHERE is_featured = 1 
      ORDER BY id DESC 
      LIMIT 10
    `);

    // Get schedule data (sorted by day and discipline)
    const [scheduleData] = await db.query(`
      SELECT * FROM dashboard_schedule_data 
      ORDER BY 
        FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        discipline
    `);

    // Get all image assets
    const [imageAssets] = await db.query('SELECT * FROM dashboard_image_assets');

    // Format schedule data for frontend (grouped by discipline)
    const rollerSchedule = scheduleData.filter(s => s.discipline === 'Roller Skating');
    const iceSchedule = scheduleData.filter(s => s.discipline === 'Ice Skating');
    const rollBallSchedule = scheduleData.filter(s => s.discipline === 'Roll Ball');

    // Format records data (grouped by discipline)
    const rollerRecords = recordsData.filter(r => r.discipline === 'Roller Skating');
    const iceRecords = recordsData.filter(r => r.discipline === 'Ice Skating');
    const rollBallRecords = recordsData.filter(r => r.discipline === 'Roll Ball');

    // Format image assets as key-value pairs for easy access
    const images = {};
    imageAssets.forEach(asset => {
      images[asset.asset_key] = asset.asset_path;
    });

    return res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        stats: statsData,
        programs: programsData,
        coaches: coachesData,
        achievements: achievementsData,
        records: {
          all: recordsData,
          roller: rollerRecords,
          ice: iceRecords,
          rollBall: rollBallRecords
        },
        schedule: {
          all: scheduleData,
          roller: rollerSchedule,
          ice: iceSchedule,
          rollBall: rollBallSchedule
        },
        images: images
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching dashboard data.",
      error: error.message
    });
  }
});

// Endpoint to send data for profile page
app.get("/vsa/profile", middlewares.verifyToken, async (req, res) => {
  try {

    const userId = req.user.userId;

    const [userData] = await db.query(
      `SELECT id, user_id, full_name, mobile, email, is_admin, is_verified, created_at 
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (userData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch all addresses for that user
    const [addressData] = await db.query(
      `SELECT id, address_line1, address_line2, city, state, postal_code, country,
              full_name, mobile, is_default, is_gift, created_at
       FROM user_address
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: userData[0],
      addresses: addressData,
    });

  } catch (error) {
    console.error("Profile fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

// Update User Profile
app.put("/vsa/update-profile", middlewares.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, mobile } = req.body;

    if (!fullName && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    let query = "UPDATE users SET ";
    const params = [];

    if (fullName) {
      query += "full_name = ?, ";
      params.push(fullName);
    }

    if (mobile) {
      query += "mobile = ?, ";
      params.push(mobile);
    }

    query = query.slice(0, -2); // remove comma
    query += " WHERE id = ?";
    params.push(userId);

    await db.query(query, params);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

// Add new address
app.post("/vsa/add-new-address", middlewares.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = "India",
      full_name,
      mobile,
      is_default = false,
      is_gift = false
    } = req.body;

    if (!address_line1 || !city || !state || !postal_code) {
      return res.status(400).json({
        success: false,
        message: "Required address fields missing"
      });
    }

    // If this address is default, remove default from others
    if (is_default) {
      await db.query(
        `UPDATE user_address SET is_default = FALSE WHERE user_id = ?`,
        [userId]
      );
    }

    await db.query(
      `INSERT INTO user_address 
       (user_id, address_line1, address_line2, city, state, postal_code, country,
        full_name, mobile, is_default, is_gift)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, address_line1, address_line2, city, state, postal_code, country,
        full_name, mobile, is_default, is_gift
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Address added successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

// Update existing address
app.put("/vsa/update-address", middlewares.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      addressId,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      full_name,
      mobile,
      is_default
    } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required"
      });
    }

    // Check if address belongs to user
    const [check] = await db.query(
      `SELECT id FROM user_address WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized"
      });
    }

    // If default is being set, remove from others
    if (is_default === true) {
      await db.query(
        `UPDATE user_address SET is_default = FALSE WHERE user_id = ?`,
        [userId]
      );
    }

    let query = "UPDATE user_address SET ";
    const params = [];

    if (address_line1) { query += "address_line1 = ?, "; params.push(address_line1); }
    if (address_line2) { query += "address_line2 = ?, "; params.push(address_line2); }
    if (city)         { query += "city = ?, "; params.push(city); }
    if (state)        { query += "state = ?, "; params.push(state); }
    if (postal_code)  { query += "postal_code = ?, "; params.push(postal_code); }
    if (country)      { query += "country = ?, "; params.push(country); }
    if (full_name)    { query += "full_name = ?, "; params.push(full_name); }
    if (mobile)       { query += "mobile = ?, "; params.push(mobile); }
    if (is_default != null) { query += "is_default = ?, "; params.push(is_default); }

    query = query.slice(0, -2);
    query += " WHERE id = ? AND user_id = ?";
    params.push(addressId, userId);

    await db.query(query, params);

    return res.status(200).json({
      success: true,
      message: "Address updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

app.post("/vsa/password-change/request", middlewares.verifyToken, async (req, res) => {
  try {
    const email  = req.user.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const [userCheck] = await db.query("SELECT * FROM users WHERE email=?", [email]);

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Update DB
    await db.query(
      "UPDATE users SET reset_otp = ?, otp_expiry = ? WHERE email = ?",
      [otp, expiry, email]
    );

    // Send Email
    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL_VALIDATOR_EMAIL,
      to: email,
      subject: "Your Password Change OTP",
      html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>Your OTP is: <strong>${otp}</strong></h2>
        <p>This OTP is valid for 10 minutes.</p>
      </div>`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent to registered email",
    });

  } catch (error) {
    console.error("OTP Send Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/vsa/password-change/verify", middlewares.verifyToken, async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;
    const  email  = req.user.email;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, newPassword & confirmPassword are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match",
      });
    }

    // Validate password format
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and contain both letters and numbers.",
      });
    }

    // Fetch user
    const [userData] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (userData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userData[0];

    // OTP validation
    if (!user.reset_otp || user.reset_otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update DB
    await db.query(
      "UPDATE users SET password=?, reset_otp=NULL, otp_expiry=NULL WHERE email=?",
      [hashedPassword, email]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Password Change Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/vsa/roller-speed-skating-discipline", async (req, res) => {
  try {
    const [eventsData] = await db.query(
      `SELECT * FROM skating_events_and_tours 
      WHERE competition_category NOT IN ('Ice Skating') 
      ORDER BY event_date DESC`);

    const formattedEvents = eventsData.map(event => {
      const eventDate = new Date(event.event_date);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      return {
        date : eventDate.getDate().toString(),
        month : months[eventDate.getMonth()],
        year : eventDate.getFullYear().toString(),
        title : event.title,
        description: event.description,
        category: event.competition_level,
        location: event.location,
        tourFees: event.tour_fees
      };
    });


    return res.status(200).json({
      success : true,
      message : "Events and tour data fetched successfully",
      events : formattedEvents
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success : false,
      message : "Failed to fetch Events and tour data",
      error: error.message
    });
  }
});

app.get("/vsa/ice-skating-discipline", async (req, res) => {
  try {
    const [eventsData] = await db.query(
      `SELECT * FROM skating_events_and_tours 
      WHERE competition_category NOT IN ('Roller Speed Skating', 'Roll Ball') 
      ORDER BY event_date DESC`);

    const formattedEvents = eventsData.map(event => {
      const eventDate = new Date(event.event_date);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      return {
        date : eventDate.getDate().toString(),
        month : months[eventDate.getMonth()],
        year : eventDate.getFullYear().toString(),
        title : event.title,
        description: event.description,
        category: event.competition_level,
        location: event.location,
        tourFees: event.tour_fees
      };
    });


    return res.status(200).json({
      success : true,
      message : "Events and tour data fetched successfully",
      events : formattedEvents
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success : false,
      message : "Failed to fetch Events and tour data",
      error: error.message
    });
  }
});

app.get("/vsa/meet-our-coaches", async (req, res) => {
  try {
    const [coachesData] = await db.query('SELECT * FROM coaches');
    return res.status(200).json({
      success : true,
      message : "Coaches Data fetched succesfully",
      totalCoaches : coachesData.length,
      coaches : coachesData
    });
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Coaches Data not found",
      error : error.message
    });
  }
});

app.get("/vsa/academy-achievements", async (req, res) => {
  try {

    const [academyAchievementsData] = await db.query(
      `SELECT * FROM academy_achievements ORDER BY id DESC`);

    const [images] = await db.query("SELECT * FROM academy_achievements_images ORDER BY academy_achievement_id DESC");

    const academyAchievementsImages = academyAchievementsData.map((achievement) => {
      const relatedImages = images.filter(img => img.academy_achievement_id === achievement.id)
      .map(img => img.images_url);
      return {
        ...achievement, 
        images : relatedImages
      }
    });

    return res.status(200).json({
      success : true,
      message : "Academy Achievements fetched successfully",
      academyAchievements : academyAchievementsImages
    });

  } catch (error) {
    
    return res.status(500).json({
      success : false,
      message : "Failed to fetch Academy Achievements data",
      error : error.message
    });
  }
});

app.get("/vsa/student_achievements", async (req, res) => {
  try {
    const [studentsData] = await db.query(`
      SELECT student_id, img, full_name, father_name, mother_name, school_name, 
             student_group, status 
      FROM students
    `);

    if (studentsData.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found",
        data: []
      });
    }

    const studentIds = studentsData.map(s => s.student_id);

    const [achievements] = await db.query(
      `SELECT * FROM student_achievements WHERE student_id IN (?)`,
      [studentIds]
    );

    const finalOutput = studentsData.map(student => {
      const studentAchievements = achievements.filter(a => a.student_id === student.student_id);

      return {
        ...student,
        achievements: studentAchievements.map(a => ({
          achievement_title: a.achievement_title,
          achievement_type: a.achievement_type,
          achievement_level: a.achievement_level,
          event_name: a.event_name,
          remarks: a.remarks,
          link: a.link,
          date_of_achievement: a.date_of_achievement
        }))
      };
    });

    res.status(200).json({
      success: true,
      message: "Students Achievements fetched successfully",
      data: finalOutput
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Students Achievements",
      error: error.message
    });
  }
});

app.post("/vsa/newsletter-subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const checkEmailQuery =
      "SELECT id FROM newsletter_subscribers WHERE email = ?";
    const [existingEmail] = await db.query(checkEmailQuery, [email]);

    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed to our newsletter",
      });
    }

    const insertQuery = `
      INSERT INTO newsletter_subscribers (email, subscribed_at, status) 
      VALUES (?, NOW(), 'active')
    `;

    await db.query(insertQuery, [email]);
    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

// Admin functionlaity endpoints starts here
app.get(
  "/vsa/admin/manage-admins",
  middlewares.verifyToken,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      // Check if user has permission to manage admins
      if (!req.user.permissions || !req.user.permissions.show_manage_admins) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have access to this section.",
        });
      }

      // Fetch all users + their permissions
      const [allUsers] = await db.query(`
      SELECT 
        u.id,
        u.user_id,
        u.full_name,
        u.email,
        u.is_admin,
        a.show_order_status,
        a.show_edit_shop,
        a.show_edit_achievements,
        a.show_invoice_generation,
        a.show_online_sales,
        a.show_offline_customers,
        a.show_online_users,
        a.show_available_stocks,
        a.show_offline_sales,
        a.show_send_mails,
        a.show_new_student,
        a.show_attendance,
        a.show_manage_students,
        a.show_students_achievements,
        a.show_attendance_records,
        a.show_news_letter,
        a.show_manage_admins,
        a.show_manage_dashboard
      FROM users u
      LEFT JOIN admin_access a ON u.user_id = a.user_id
      ORDER BY u.created_at DESC
    `);

      return res.status(200).json({
        success: true,
        users: allUsers,
      });
    } catch (error) {
      console.error("Error fetching users with permissions:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

//Endpoint to toggle permission for individual users for admin-
app.post(
  "/vsa/admin/update-permission",
  middlewares.verifyToken,
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Check admin access
      if (!req.user.isAdmin) {
        await connection.rollback();
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      const { userId, permissionKey, value } = req.body;

      // Call the admin function
      const result = await admin.updateAdminPermission(
        userId,
        permissionKey,
        value,
        connection
      );

      await connection.commit();
      res.json(result);
    } catch (error) {
      await connection.rollback();
      console.error("Error updating permission:", error);

      // Handle different error types
      if (error.message.includes("Missing or invalid required fields")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("Invalid permission key")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("User not found")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update permission",
      });
    } finally {
      connection.release();
    }
  }
);

//This create invoice functionlaity is yet to be tested and completed
app.get("/vsa/create-invoice", middlewares.verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const itemsData = [
      "skates-and-boots",
      "wheels",
      "helmets",
      "bearings",
      "accessories",
    ];
    const allItemsData = {};
    // Getting all the available stock
    for (var i = 0; i < itemsData.length; i++) {
      const [results] = await db.query(
        `SELECT * FROM stock_${itemsData[i]} WHERE quantity >= 1`
      );
      allItemsData[itemsData[i]] = results;
    }

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: allItemsData,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product data",
    });
  }
});

app.get(
  "/vsa/download-online-sale-list",
  middlewares.verifyToken,
  async (req, res) => {
    console.log("In sale download");
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    try {
      // Getting the data from DB for all the completed sale
      const [saleData] = await db.query(
        "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC",
        ["Delivered"]
      );
      admin.downloadOnlineSaleList(req, res, saleData);
    } catch (error) {
      console.error("Error fetching online sale list:", error);
      res.status(500).send("Error fetching online sale list");
    }
  }
);

// Multer config to upload image/files
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/images/students"),
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const filename = `student-${timestamp}${fileExt}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Endpoint to register a new student admin side
app.post(
  "/vsa/admin/register-new-student",
  middlewares.verifyToken,
  upload.single("studentImage"),
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      // Check admin access
      if (!req.user.isAdmin) {
        await connection.rollback();
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      const validationErrors = validateStudent(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          validationErrors,
        });
      }
      await connection.beginTransaction();
      const result = await admin.registerNewStudent(
        req.body,
        req.file,
        connection
      );

      if (result.success) {
        await connection.commit();
        res.json(result);
      } else {
        await connection.rollback();
        res.status(400).json(result);
      }
    } catch (error) {
      await connection.rollback();
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during registration",
      });
    } finally {
      if (connection) connection.release();
    }
  }
);

// Function to validate student -
function validateStudent(data) {
  const errors = [];

  // img (optional)
  if (data.img && typeof data.img !== "string") {
    errors.push("Image must be a string");
  }

  // fullName
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name is required and must be at least 2 characters long");
  }

  // fatherName
  if (data.fatherName && typeof data.fatherName !== "string") {
    errors.push("Father name must be a string");
  }

  // motherName
  if (data.motherName && typeof data.motherName !== "string") {
    errors.push("Mother name must be a string");
  }

  // email
  if (!data.email) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  // mobileNumber
  if (!data.mobileNumber) {
    errors.push("Mobile number is required");
  } else if (!/^\d{10}$/.test(data.mobileNumber)) {
    errors.push("Mobile number must be 10 digits");
  }

  // whatsappNumber
  if (data.whatsappNumber && !/^\d{10}$/.test(data.whatsappNumber)) {
    errors.push("WhatsApp number must be 10 digits");
  }

  // dob
  if (!data.dob) {
    errors.push("Date of birth is required");
  } else if (isNaN(Date.parse(data.dob))) {
    errors.push("Invalid date of birth format");
  }

  // className
  if (!data.className) {
    errors.push("Class is required");
  }

  // gender
  if (!data.gender) {
    errors.push("Gender is required");
  } else if (!["Male", "Female", "Other"].includes(data.gender)) {
    errors.push("Gender must be Male, Female, or Other");
  }

  // schoolName (optional)
  if (data.schoolName && typeof data.schoolName !== "string") {
    errors.push("School name must be a string");
  }

  // studentGroup (optional)
  if (data.studentGroup && typeof data.studentGroup !== "string") {
    errors.push("Student group must be a string");
  }

  // skateType (optional)
  if (data.skateType && typeof data.skateType !== "string") {
    errors.push("Skate type must be a string");
  }

  // feeStructure (optional)
  if (data.feeStructure && typeof data.feeStructure !== "string") {
    errors.push("Fee structure must be a string");
  }

  // feeCycle (optional but must be valid if given)
  if (
    data.feeCycle &&
    !["Monthly", "Quarterly", "Half-Yearly", "Yearly"].includes(data.feeCycle)
  ) {
    errors.push("Fee cycle must be Monthly, Quarterly, or Yearly");
  }

  // transportation (optional boolean)
  // if (data.transportation !== undefined && typeof data.transportation !== 'boolean') {
  //   errors.push('Transportation must be true or false');
  // }

  // status (optional, default to Active/Inactive)
  if (data.status && !["Active", "Inactive"].includes(data.status)) {
    errors.push("Status must be Active or Inactive");
  }

  // addressLine1 (optional)
  if (data.addressLine1 && typeof data.addressLine1 !== "string") {
    errors.push("Address Line 1 must be a string");
  }

  // addressLine2 (optional)
  if (data.addressLine2 && typeof data.addressLine2 !== "string") {
    errors.push("Address Line 2 must be a string");
  }

  // city (optional)
  if (data.city && typeof data.city !== "string") {
    errors.push("City must be a string");
  }

  // state (optional)
  if (data.state && typeof data.state !== "string") {
    errors.push("State must be a string");
  }

  // postalCode (optional, but if present must be valid)
  if (data.postalCode && !/^\d{6}$/.test(data.postalCode)) {
    errors.push("Postal code must be 6 digits");
  }

  return errors;
}

// Endpoint to populate students attendance-page
app.get(
  "/vsa/admin/get-students-for-attendance",
  middlewares.verifyToken,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      let choosenDate = req.query.date || new Date().toISOString().slice(0, 10);
      // Get attendance details as per the date

      const [attendanceDetails] = await db.query(
        `SELECT s.student_id, s.full_name, s.mother_name, sa.status, sa.attendance_date
       FROM students s
       LEFT JOIN students_attendance sa
        ON s.student_id = sa.student_id
        AND sa.attendance_date = ? WHERE s.status = 'active'`,
        [choosenDate]
      );

      res.status(200).json({
        success: true,
        date: choosenDate,
        attendanceDetails: attendanceDetails,
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while fetching attendance",
        error: error.message,
      });
    }
  }
);

// Endpoint to mark attendance of student
app.post(
  "/vsa/admin/mark-attendance",
  middlewares.verifyToken,
  async (req, res) => {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      const { date, studentId, status } = req.body;

      // Validate required fields
      if (!date || !studentId || !status) {
        return res.status(400).json({
          success: false,
          message: "Date, student ID, and status are required fields",
        });
      }

      // Validate status enum
      const validStatuses = ["Present", "Absent", "Sick"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be one of: Present, Absent, Sick",
        });
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Date must be in YYYY-MM-DD format",
        });
      }

      // Check if the student exists and is active
      const [studentCheck] = await db.query(
        'SELECT student_id, full_name FROM students WHERE student_id = ? AND status = "active"',
        [studentId]
      );

      if (studentCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found or inactive",
        });
      }

      const markedBy = req.user.userId || req.user.email;

      // Check if attendance record already exists for this student and date
      const [existingRecord] = await db.query(
        "SELECT id FROM students_attendance WHERE student_id = ? AND attendance_date = ?",
        [studentId, date]
      );

      if (existingRecord.length > 0) {
        // Update existing record
        const [updateResult] = await db.query(
          `UPDATE students_attendance 
         SET status = ?, marked_by = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE student_id = ? AND attendance_date = ?`,
          [status, markedBy, studentId, date]
        );

        if (updateResult.affectedRows > 0) {
          return res.status(200).json({
            success: true,
            message: `Attendance updated successfully for ${studentCheck[0].full_name}`,
            data: {
              studentId: studentId,
              studentName: studentCheck[0].full_name,
              status: status,
              date: date,
              action: "updated",
            },
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to update attendance record",
          });
        }
      } else {
        // Insert new record
        const [insertResult] = await db.query(
          `INSERT INTO students_attendance (student_id, status, attendance_date, marked_by) 
         VALUES (?, ?, ?, ?)`,
          [studentId, status, date, markedBy]
        );

        if (insertResult.insertId) {
          return res.status(201).json({
            success: true,
            message: `Attendance marked successfully for ${studentCheck[0].full_name}`,
            data: {
              attendanceId: insertResult.insertId,
              studentId: studentId,
              studentName: studentCheck[0].full_name,
              status: status,
              date: date,
              action: "created",
            },
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to create attendance record",
          });
        }
      }
    } catch (error) {
      console.error("Error marking attendance:", error);

      // Handle specific database errors
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Attendance record already exists for this student and date",
        });
      }

      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID or foreign key constraint violation",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Something went wrong while marking attendance",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// Endpoint to get particular data of all students for ManageStudents.vue page
app.get(
  "/vsa/admin/get-students-for-managing",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const [studentDetails] = await db.query(
      `SELECT s.student_id, s.full_name, s.mother_name, s.student_group, s.pending_fee 
      FROM students AS s`
    );

    if (studentDetails.length === 0) {
      return res.status(204).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      studentDetails: studentDetails,
    });
  }
);

// Endpoint to get single student when admin clicks on a particular row in ManageStudents.vue page
app.get(
  "/vsa/admin/get-student-for-managing",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { studentId } = req.query;
    // Get the student with this studentId
    const [studentDetail] = await db.query(
      `
    SELECT s.*, sa.*, sf.*
    FROM students AS s
    LEFT JOIN student_address AS sa ON s.student_id = sa.student_id
    LEFT JOIN student_fee AS sf ON s.student_id = sf.student_id
    WHERE s.student_id = ?
    `,
      [studentId]
    );

    if (studentDetail.length === 0) {
      return res.status(204).json({
        success: false,
        message: "No student found.",
      });
    }

    return res.status(200).json({
      success: true,
      studentDetail: studentDetail,
    });
  }
);

// Endpoint to update student data from ManageStudents.vue page NEEDS TO BE FIXED
app.put(
  "/vsa/admin/update-student",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const {
      student_id,
      // Students table fields
      full_name,
      father_name,
      mother_name,
      email,
      mobile_number,
      whatsapp_number,
      dob,
      class: studentClass,
      gender,
      school_name,
      hobbies,
      student_group,
      skate_type,
      fee_structure,
      fee_cycle,
      next_payment_date,
      pending_fee,
      transportation,
      status,
      // Student address fields
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      // Student fee fields
      transaction_id,
      amount_paid,
      remarks,
      payment_mode,
      payment_status,
      payment_date,
    } = req.body;

    // Basic validation
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    // Email validation only if email is provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format.",
        });
      }
    }

    // Mobile number validation only if mobile number is provided
    if (mobile_number) {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile_number.replace(/\D/g, "").slice(-10))) {
        return res.status(400).json({
          success: false,
          message: "Invalid mobile number format.",
        });
      }
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Check if student exists
      const [existingStudent] = await connection.query(
        "SELECT * FROM students WHERE student_id = ?",
        [student_id]
      );

      if (existingStudent.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const currentStudent = existingStudent[0];

      // Check if email is already used by another student (only if email is being updated)
      if (email && email !== currentStudent.email) {
        const [emailCheck] = await connection.query(
          "SELECT student_id FROM students WHERE email = ? AND student_id != ?",
          [email, student_id]
        );

        if (emailCheck.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: "Email is already registered with another student.",
          });
        }
      }

      // Build dynamic update query for students table
      const studentUpdates = [];
      const studentValues = [];

      // Helper function to add field to update if it exists in request
      const addFieldUpdate = (fieldName, value, dbFieldName = fieldName) => {
        if (value !== undefined) {
          studentUpdates.push(`${dbFieldName} = ?`);
          studentValues.push(value || null);
        }
      };

      addFieldUpdate("full_name", full_name);
      addFieldUpdate("father_name", father_name);
      addFieldUpdate("mother_name", mother_name);
      addFieldUpdate("email", email);
      addFieldUpdate("mobile_number", mobile_number);
      addFieldUpdate("whatsapp_number", whatsapp_number);
      addFieldUpdate("dob", dob);
      addFieldUpdate("class", studentClass);
      addFieldUpdate("gender", gender);
      addFieldUpdate("school_name", school_name);
      addFieldUpdate("hobbies", hobbies);
      addFieldUpdate("student_group", student_group);
      addFieldUpdate("skate_type", skate_type);
      addFieldUpdate("fee_structure", fee_structure);
      addFieldUpdate("fee_cycle", fee_cycle);
      addFieldUpdate("next_payment_date", next_payment_date);
      addFieldUpdate("pending_fee", pending_fee);
      addFieldUpdate("transportation", transportation);
      addFieldUpdate("status", status);

      // Only update students table if there are fields to update
      if (studentUpdates.length > 0) {
        studentUpdates.push("updated_at = CURRENT_TIMESTAMP");
        studentValues.push(student_id);

        const updateQuery = `UPDATE students SET ${studentUpdates.join(
          ", "
        )} WHERE student_id = ?`;
        await connection.query(updateQuery, studentValues);
      }

      // Handle address updates only if address fields are provided
      const addressFields = {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      };
      const hasAddressData = Object.values(addressFields).some(
        (value) => value !== undefined
      );

      if (hasAddressData) {
        // Check if address record exists
        const [existingAddress] = await connection.query(
          "SELECT * FROM student_address WHERE student_id = ?",
          [student_id]
        );

        const addressUpdates = [];
        const addressValues = [];

        addFieldUpdate("address_line1", address_line1);
        addFieldUpdate("address_line2", address_line2);
        addFieldUpdate("city", city);
        addFieldUpdate("state", state);
        addFieldUpdate("postal_code", postal_code);
        addFieldUpdate("country", country);

        if (addressUpdates.length > 0) {
          if (existingAddress.length > 0) {
            // Update existing address
            addressUpdates.push("updated_at = CURRENT_TIMESTAMP");
            addressValues.push(student_id);

            const addressUpdateQuery = `UPDATE student_address SET ${addressUpdates.join(
              ", "
            )} WHERE student_id = ?`;
            await connection.query(addressUpdateQuery, addressValues);
          } else {
            // Insert new address record only if we have at least address_line1, city, state, postal_code
            const requiredAddressFields = [
              address_line1,
              city,
              state,
              postal_code,
            ];
            const hasRequiredFields = requiredAddressFields.every(
              (field) => field !== undefined && field !== null && field !== ""
            );

            if (hasRequiredFields) {
              await connection.query(
                `
              INSERT INTO student_address (
                student_id, address_line1, address_line2, city, state, postal_code, country
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
                [
                  student_id,
                  address_line1,
                  address_line2 || null,
                  city,
                  state,
                  postal_code,
                  country || "India",
                ]
              );
            }
          }
        }
      }

      // Handle fee updates only if fee-related data is provided
      const feeFields = {
        transaction_id,
        amount_paid,
        remarks,
        payment_mode,
        payment_status,
        payment_date,
      };
      const hasFeeData = Object.values(feeFields).some(
        (value) => value !== undefined
      );

      if (hasFeeData) {
        // Get the latest fee record for this student
        const [latestFee] = await connection.query(
          "SELECT id FROM student_fee WHERE student_id = ? ORDER BY created_at DESC LIMIT 1",
          [student_id]
        );

        const feeUpdates = [];
        const feeValues = [];

        addFieldUpdate("transaction_id", transaction_id);
        addFieldUpdate("amount_paid", amount_paid);
        addFieldUpdate("remarks", remarks);
        addFieldUpdate("payment_mode", payment_mode);
        addFieldUpdate("status", payment_status);
        addFieldUpdate("payment_date", payment_date);

        if (feeUpdates.length > 0) {
          if (latestFee.length > 0) {
            // Update the latest fee record
            feeUpdates.push("updated_at = CURRENT_TIMESTAMP");
            feeValues.push(latestFee[0].id);

            const feeUpdateQuery = `UPDATE student_fee SET ${feeUpdates.join(
              ", "
            )} WHERE id = ?`;
            await connection.query(feeUpdateQuery, feeValues);
          } else if (amount_paid !== undefined && amount_paid > 0) {
            // Insert new fee record only if amount is provided and > 0
            await connection.query(
              `
            INSERT INTO student_fee (
              student_id, transaction_id, amount_paid, remarks, payment_mode, status, payment_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
              [
                student_id,
                transaction_id || null,
                amount_paid,
                remarks || null,
                payment_mode || "cash",
                payment_status || "success",
                payment_date || new Date().toISOString().split("T")[0],
              ]
            );
          }
        }
      }

      await connection.commit();

      // Fetch updated student data to return
      const [updatedStudent] = await connection.query(
        `
      SELECT s.*, 
             sa.address_line1, sa.address_line2, sa.city, sa.state, sa.postal_code, sa.country,
             sf.transaction_id, sf.amount_paid, sf.remarks, sf.payment_mode, 
             sf.status as payment_status, sf.payment_date
      FROM students AS s
      LEFT JOIN student_address AS sa ON s.student_id = sa.student_id
      LEFT JOIN student_fee AS sf ON s.student_id = sf.student_id
      WHERE s.student_id = ?
      ORDER BY sf.created_at DESC
      LIMIT 1
    `,
        [student_id]
      );

      return res.status(200).json({
        success: true,
        message: "Student updated successfully.",
        studentDetail: updatedStudent,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error updating student:", error);

      // Handle specific database errors
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Duplicate entry detected. Please check unique fields.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error while updating student.",
      });
    } finally {
      connection.release();
    }
  }
);

// Endpoint to get all students for ManageAchievements.vue
app.get(
  "/vsa/admin/get-students-for-manage-achievements",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const [studentDetails] = await db.query(
      `SELECT s.student_id, s.full_name, s.mother_name, s.student_group
      FROM students AS s`
    );

    if (studentDetails.length === 0) {
      return res.status(204).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      studentDetails: studentDetails,
    });
  }
);

// End to get single students achievements.
app.get(
  "/vsa/admin/get-student-for-manage-achievements",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { studentId } = req.query;
    // Get the student with this studentId
    const [studentAchievementsDetail] = await db.query(
      `
    SELECT s.*, sa.*
    FROM students AS s
    LEFT JOIN student_achievements AS sa ON s.student_id = sa.student_id
    WHERE s.student_id = ?
    `,
      [studentId]
    );

    if (studentAchievementsDetail.length === 0) {
      return res.status(204).json({
        success: false,
        message: "No student achievement found.",
      });
    }

    return res.status(200).json({
      success: true,
      studentAchievementsDetail: studentAchievementsDetail,
    });
  }
);

// Endpoint to add a new achievement
app.post("/vsa/admin/add-new-achievement", middlewares.verifyToken, async (req, res) => {

  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  const {
    studentId,
    achievementTitle,
    achievementType,
    achievementLevel,
    eventName,
    remarks,
    link,
    dateOfAchievement,
  } = req.body;
  console.log(dateOfAchievement);
  if (!studentId || !achievementTitle) {
    return res.status(400).json({
      success: false,
      message: "Student ID and achievement title are required.",
    });
  }

  const connection = await db.getConnection();

  try {
    
    const [[student]] = await connection.query(
      "SELECT id FROM students WHERE student_id = ?",
      [studentId]
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Invalid Student ID.",
      });
    }

    
    await connection.query(
      `INSERT INTO student_achievements 
      (student_id, achievement_title, achievement_type, achievement_level, event_name, remarks, link, date_of_achievement)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        achievementTitle,
        achievementType || "competition",
        achievementLevel || "school",
        eventName || null,
        remarks || null,
        link || null,
        dateOfAchievement || new Date(),
      ]
    );

    
    return res.status(201).json({
      success: true,
      message: "Student achievement added successfully.",
    });

  } catch (error) {
    console.error("Error adding achievement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  } finally {
    connection.release();
  }
});

// Endpoint to delete a achievement
app.delete("/vsa/admin/delete-achievement/:achievementId", middlewares.verifyToken, async (req, res) => {

  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  const { achievementId } = req.params;

  if (!achievementId) {
    return res.status(400).json({
      success: false,
      message: "Achievement ID is required.",
    });
  }

  const connection = await db.getConnection();

  try {
    const [[achievement]] = await connection.query(
      "SELECT id FROM student_achievements WHERE id = ?",
      [achievementId]
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found. Invalid Achievement ID.",
      });
    }

    await connection.query(
      "DELETE FROM student_achievements WHERE id = ?",
      [achievementId]
    );

    return res.status(200).json({
      success: true,
      message: "Achievement deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting achievement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  } finally {
    connection.release();
  }
});

// Endpoint to get all the students to display on attendance records page
app.get(
  "/vsa/admin/get-students-for-attendance-records",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const result = await admin.getStudentsForAttendanceRecords(db);
    return res.status(result.statusCode).json(result);
  }
);

// Endpoint to fetch particular student attendance record
app.get(
  "/vsa/admin/get-student-attendance/:studentId",
  middlewares.verifyToken,
  async (req, res) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { studentId } = req.params;
    const { month, year } = req.query;

    const result = await admin.getStudentAttendance(db, studentId, month, year);
    return res.status(result.statusCode).json(result);
  }
);

// Asset key for images
const assestkeys = [
    "logo_image", "hero_image", "skate_icon", "check_icon", "roller_skate_image",
    "ice_skate_image", "skating_banner", "roller_speed_image", "roller_icon", "ice_icon",
    "ice_speed_image"
];

const uploadFields = assestkeys.map(key => ({name : key, maxCount : 1}));

// Endpoint to update the values for images in the dasboard
app.put("/vsa/admin/edit-image-assets", middlewares.verifyToken
  , upload.fields(uploadFields), async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const result = await admin.updatedDashboardImages(req.files, connection);

    if(result.success) {
      await connection.commit();
      res.status(200).json(result);
    } else {
      await connection.rollback();
      res.status(400).json(result);
    }
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({
        success: false,
        message: "Internal server error while updating images for dashboard",
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to update stats in the dashboard
// These stats label is used as keys in the frontend
const statsLabel = ["Active_Students", "Expert_Coaches", "Championships_Won", "Years_Experience"];

const uploadStatsFields = statsLabel.map(key => ({name : key , maxCount : 1}));

app.put("/vsa/admin/edit-stats", middlewares.verifyToken
, upload.fields(uploadStatsFields), async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const result = await admin.updateStats(req, connection);

    if(result.success) {
      await connection.commit();
      res.status(200).json(result);
    } else {
      await connection.rollback();
      res.status(400).json(result);
    }
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({
        success: false,
        message: "Internal server error while updating stats for dashboard",
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to add new record 
app.post("/vsa/admin/add-new-record", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const validDisciplines = ['Roller Skating', 'Ice Skating', 'Roll Ball'];
    const {records} = req.body;
 
    connection = await db.getConnection();
    await connection.beginTransaction();

    for(const record of records) {
       if (!/^\d{4}$/.test(record.year)) {
        return res.status(400).json({
          success: false,
          message: "Year must be a valid 4-digit number"
        });
      }
      if(validDisciplines.includes(record.discipline)) {
        await connection.query(
          `INSERT INTO dashboard_records_data 
          (event, time, studentName, discipline, year, is_featured) VALUES (?,?,?,?,?,?)`,
        [record.event, record.time, record.studentName, record.discipline, record.year, record.isFeatured]);
      } else continue;
      
    }
    await connection.commit();
    return res.status(200).json({
      success : true,
      message : "Records added successfully",
    });

  } catch (error) {
    if (connection) await connection.rollback();
    return res.status(500).json({
      success : false,
      message : "Internal Server Error, Please try again",
      error : error.message
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to update schedule
app.put("/vsa/admin/update-schedule", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { allSchedule } = req.body;

    if (!allSchedule || allSchedule.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No schedule data received"
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const result = await admin.updateSchedule(connection, allSchedule);

    if(result.success) {
      await connection.commit();
      return res.status(200).json({
        success: result.success,
        message: result.message,
        updatedRows: result.updatedRows,
      });
    } else {
      if (connection) await connection.rollback();
      return res.status(400).json({
        success: result.success,
        message: result.message,
      });
    }

  } catch (error) {
    if (connection) await connection.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, Please try again",
      error: error.message
    });

  } finally {
    if (connection) connection.release();
  }
});

// Enpoint to update programs
app.put("/vsa/admin/update-programs", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const {updatedProgramsData} = req.body;
    
    if (!updatedProgramsData || updatedProgramsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No program data received"
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();
    
    const result = await admin.updatePrograms(connection, updatedProgramsData);

    if(result.success) {
      await connection.commit();
      return res.status(200).json({
        success: result.success,
        message: result.message,
        updatedRows: result.updatedCount,
      });
    } else {
      if (connection) await connection.rollback();
      return res.status(400).json({
        success: result.success,
        message: result.message,
      });
    }

  } catch (error) {
    if (connection) await connection.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, Please try again",
      error: error.message
    });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to update coaches 
app.put("/vsa/admin/update-coaches", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const {updatedCoachesData} = req.body;
    
    if (!updatedCoachesData || updatedCoachesData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No coaches data received"
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const result = await admin.updateCoaches(connection, updatedCoachesData);

    if(result.success) {
      await connection.commit();
      return res.status(200).json({
        success: result.success,
        message: result.message,
        updatedRows: result.updatedRows,
      });
    } else {
      if (connection) await connection.rollback();
      return res.status(400).json({
        success: result.success,
        message: result.message,
      });
    }

  } catch (error) {
    if (connection) await connection.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, Please try again",
      error: error.message
    });

  } finally {
    if (connection) connection.release();
  }

});

// Endpoint to insert new coach this is not complete and will be completed if REQUIRED ONLY also insert in coaches and dashboard_coaches_data table both to maintain consistency
app.post("/vsa/admin/add-new-coach", middlewares.verifyToken, async (req, res) => {
  let connection;
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    
    // expected data : name, specialization, experience, image, display_order
    const {coaches} = req.body;

    if (!coaches || coaches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No program data received"
      });
    }
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [insertMain] = await connection.query(
      `INSERT INTO coaches (coach_name, image, experience, specialization) VALUES (?,?,?,?)`,
      [coach_name, image, experience, specialization]
    );

    const newId = insertMain.insertId;  // <-- SAME ID

    // Insert into dashboard table using SAME ID
    await connection.query(
      `INSERT INTO dashboard_coaches_data (id, name, specialization, experience, image, display_order) 
       VALUES (?,?,?,?,?,?)`,
      [newId, coach_name, specialization, experience, image, 0]
    );

  } catch (error) {
    if (connection) await connection.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, Please try again",
      error: error.message
    });

  } finally {
    if (connection) connection.release();
  }
});

// Dynamic multer configuration for handling multiple variation images for shop
const itemStorage = multer.diskStorage({
  destination: path.join(__dirname, "public/images/shop-item-images"),
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const filename = `item-${timestamp}-${Math.random().toString(36).substring(7)}${fileExt}`;
    cb(null, filename);
  },
});

const itemUpload = multer({ storage: itemStorage });

// Endpoint to add new item, will be used to add skates_and_boots, wheels, helmets, accessories
app.post("/vsa/admin/add-new-item", 
  middlewares.verifyToken,
  itemUpload.any(), // Accept any number of files with any field names
  async (req, res) => {
    let connection;
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      // Parse itemData from request body
      const itemData = typeof req.body.itemData === 'string' 
        ? JSON.parse(req.body.itemData) 
        : req.body.itemData;

      const itemTypeList = ["skates_and_boots", "wheels", "helmets", "accessories"];
      
      if (!itemTypeList.includes(itemData.itemType)) {
        return res.status(400).json({
          success: false,
          message: "Wrong item type"
        });
      }

      connection = await db.getConnection();
      await connection.beginTransaction();

      const [existingItem] = await connection.query(
        `SELECT name FROM ${itemData.itemType} WHERE name = ?`, 
        [itemData.name]
      );

      if (existingItem.length > 0) {
        await connection.rollback();
        return res.status(409).json({
          success: false,
          message: "Item with this name already exists"
        });
      }

      // Construct item_id
      const itemId = getItemId(itemData.itemType, itemData.name);

      // Create a map of uploaded files by fieldname
      const fileMap = {};
      if (req.files) {
        req.files.forEach(file => {
          fileMap[file.fieldname] = "/images/shop-item-images/" + file.filename;
        });
      }

      // Handle main image upload
      const mainImagePath = fileMap['mainImage'] || itemData.mainImagePath || null;

      // Insert main table data
      await connection.query(
        `INSERT INTO ${itemData.itemType}
        (item_id, name, short_description, detailed_description, why_to_choose, 
        main_image_path, features, is_shown) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          itemData.name,
          itemData.shortDescription,
          itemData.detailedDescription,
          JSON.stringify(itemData.whyToChoose),
          mainImagePath,
          JSON.stringify(itemData.features),
          itemData.isShown ? 1 : 0
        ]
      );

      // Process variations
      const variationPromises = itemData.variationData.map(async (variant, index) => {
        const colorCode = variant.color.substring(0, 4).toUpperCase();
        const itemVariationId = `${itemId}-${colorCode}-${variant.size}`;

        // Handle base image - check if uploaded, otherwise use provided URL
        const baseImagePath = fileMap[`baseImage_${index}`] || variant.baseImage || null;

        await connection.query(
          `INSERT INTO ${itemData.itemType}_variation 
          (item_variation_id, item_id, color, size, quantity, current_price, 
          old_price, discount, base_image_path, show_on_main_page, show_as_variation) 
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemVariationId,
            itemId,
            variant.color,
            variant.size,
            variant.quantity,
            variant.currentPrice,
            variant.oldPrice || null,
            variant.discount || 0,
            baseImagePath,
            variant.showOnMainPage ? 1 : 0,
            variant.showAsVariation ? 1 : 0
          ]
        );

        // Save variation images - handle both uploaded files and URLs
        const variationImagePaths = [];
        
        // Check for uploaded files for this variation
        for (let i = 0; i < 10; i++) { // Support up to 10 images per variation
          const fieldName = `variationImage_${index}_${i}`;
          if (fileMap[fieldName]) {
            variationImagePaths.push(fileMap[fieldName]);
          }
        }

        // Add any URL-based images from the form data
        if (variant.variationImages && variant.variationImages.length > 0) {
          variant.variationImages.forEach(img => {
            if (img && img.trim()) {
              variationImagePaths.push(img);
            }
          });
        }

        // Insert all variation images
        if (variationImagePaths.length > 0) {
          const imagePromises = variationImagePaths.map(async (imagePath) => {
            await connection.query(
              `INSERT INTO ${itemData.itemType}_variation_image
              (item_variation_id, image_path) VALUES(?, ?)`,
              [itemVariationId, imagePath]
            );
          });
          await Promise.all(imagePromises);
        }
      });

      await Promise.all(variationPromises);

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: "Item added successfully",
        data: {
          itemId: itemId,
          name: itemData.name
        }
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Error adding new item:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to add item",
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

// Endpoint to add new bearing
app.post("/vsa/admin/add-new-bearing", 
  middlewares.verifyToken,
  itemUpload.any(), // Accept any number of files with any field names
  async (req, res) => {
    let connection;
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admins only.",
        });
      }

      // Parse itemData from request body
      const itemData = typeof req.body.itemData === 'string' 
        ? JSON.parse(req.body.itemData) 
        : req.body.itemData;

      connection = await db.getConnection();
      await connection.beginTransaction();

      // Check if bearing already exists
      const [existingItem] = await connection.query(
        `SELECT name FROM bearings WHERE name = ?`, 
        [itemData.name]
      );

      if (existingItem.length > 0) {
        await connection.rollback();
        return res.status(409).json({
          success: false,
          message: "Bearing with this name already exists"
        });
      }

      // Construct item_id for bearings
      const itemId = getBearingItemId(itemData.name, itemData.size);

      // Create a map of uploaded files by fieldname
      const fileMap = {};
      if (req.files) {
        req.files.forEach(file => {
          fileMap[file.fieldname] = "/images/shop-item-images/" + file.filename;
        });
      }

      // Handle main image upload
      const mainImagePath = fileMap['mainImage'] || itemData.mainImagePath || null;

      // Insert main bearings table data
      await connection.query(
        `INSERT INTO bearings
        (item_id, name, short_description, detailed_description, why_to_choose, 
        main_image_path, features, is_shown) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          itemData.name,
          itemData.shortDescription || null,
          itemData.detailedDescription || null,
          itemData.whyToChoose || null,
          mainImagePath,
          JSON.stringify(itemData.features || []),
          itemData.isShown ? 1 : 0
        ]
      );

      // Process variations
      const variationPromises = itemData.variationData.map(async (variant, index) => {
        // Create unique variation ID based on bearing-specific attributes
        const abecCode = variant.abecRating ? variant.abecRating.replace(/[^0-9]/g, '') : 'NA';
        const materialCode = variant.material ? variant.material.substring(0, 3).toUpperCase() : 'STD';
        const sizeCode = variant.size ? String(variant.size).substring(0, 3).toUpperCase() : '';
        const packCode = variant.packSize || '8';
        const typeCode = variant.bearingType ? variant.bearingType.substring(0, 3).toUpperCase() : 'STD';
        
        const itemVariationId = `${itemId}-${abecCode}-${materialCode}-${packCode}-${typeCode}`;

        // Handle base image - check if uploaded, otherwise use provided URL
        const baseImagePath = fileMap[`baseImage_${index}`] || variant.baseImage || null;

        // Validate material enum
        const validMaterials = ['Steel', 'Ceramic', 'Titanium'];
        const material = validMaterials.includes(variant.material) ? variant.material : 'Steel';

        await connection.query(
          `INSERT INTO bearings_variation 
          (item_variation_id, item_id, abec_rating, material, size, pack_size, bearing_type,
          quantity, old_price, current_price, discount, base_image_path, 
          show_on_main_page, show_as_variation) 
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemVariationId,
            itemId,
            variant.abecRating || null,
            material,
            variant.size,
            variant.packSize || null,
            variant.bearingType || null,
            variant.quantity || 0,
            variant.oldPrice || null,
            variant.currentPrice,
            variant.discount || 0,
            baseImagePath,
            variant.showOnMainPage ? 1 : 0,
            variant.showAsVariation ? 1 : 0
          ]
        );

        // Save variation images - handle both uploaded files and URLs
        const variationImagePaths = [];
        
        // Check for uploaded files for this variation
        for (let i = 0; i < 10; i++) { // Support up to 10 images per variation
          const fieldName = `variationImage_${index}_${i}`;
          if (fileMap[fieldName]) {
            variationImagePaths.push(fileMap[fieldName]);
          }
        }

        // Add any URL-based images from the form data
        if (variant.variationImages && variant.variationImages.length > 0) {
          variant.variationImages.forEach(img => {
            if (img && img.trim()) {
              variationImagePaths.push(img);
            }
          });
        }

        // Insert all variation images
        if (variationImagePaths.length > 0) {
          const imagePromises = variationImagePaths.map(async (imagePath) => {
            await connection.query(
              `INSERT INTO bearings_variation_image
              (item_variation_id, image_path) VALUES(?, ?)`,
              [itemVariationId, imagePath]
            );
          });
          await Promise.all(imagePromises);
        }
      });

      await Promise.all(variationPromises);

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: "Bearing added successfully",
        data: {
          itemId: itemId,
          name: itemData.name
        }
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Error adding new bearing:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to add bearing",
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

function getItemId(type, name) {
  let itemId = "";
  
  if (type === "skates_and_boots") {
    itemId += type.substring(0, 2); // takes "sk"
    itemId += type.substring(12, 14); // takes "bo"
  } else {
    itemId += type.substring(0, 2); // for other category takes "we", "he" etc
  }

  itemId += name.substring(0, 3).toUpperCase();
  itemId += Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return itemId.toUpperCase();
}

function getBearingItemId(name, size) {
  let itemId = "BR"; // Bearing prefix
  itemId += name.substring(0, 3).toUpperCase().replace(/\s/g, '');
  itemId += String(size).substring(0, 2).replace(/\s/g, '');
  itemId += Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return itemId;
}

// Endpoint to render the list of items in edit shop page
app.get("/vsa/admin/edit-shop-items", middlewares.verifyToken, async (req, res) => {
  try {

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    
    const [
      [skatesAndBootsData],
      [wheelsData],
      [helmetsData],
      [bearingsData],
      [accessoriesData]
    ] = await Promise.all([
      db.query("SELECT * FROM skates_and_boots"),
      db.query("SELECT * FROM wheels"),
      db.query("SELECT * FROM helmets"),
      db.query("SELECT * FROM bearings"),
      db.query("SELECT * FROM accessories")
    ]);

    return res.status(200).json({
      success: true,
      message : "Successfully fetched items data",
      skatesAndBootsData,
      wheelsData,
      helmetsData,
      bearingsData,
      accessoriesData
    });

  } catch (error) {
    console.error("Error loading shop items:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while loading shop items",
      error: error.message
    });
  }
});

// Endpoint to fetch full data of single item
app.get("/vsa/admin/get-single-item", middlewares.verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // itemName should be only these - skatesAndBoots, wheels, helmets, bearings, accessories as these will be used to find the required table.
    let {itemName, itemId} = req.query

    if (!itemName || !itemId) {
      return res.status(400).json({
        success: false,
        message: "item-name and item-id are required as query params.",
      });
    }

    // Allowed names only
    const mapping = {
      skatesAndBoots: { base: "skates_and_boots", variation: "skates_and_boots_variation" },
      wheels: { base: "wheels", variation: "wheels_variation" },
      helmets: { base: "helmets", variation: "helmets_variation" },
      bearings: { base: "bearings", variation: "bearings_variation" },
      accessories: { base: "accessories", variation: "accessories_variation" }
    };

    if (!mapping[itemName]) {
      return res.status(400).json({
        success: false,
        message: "Invalid itemName provided."
      });
    }

    const baseTable = mapping[itemName].base;
    const variationTable = mapping[itemName].variation;
    const variationImageTable = `${variationTable}_image`;

    const [itemDataWithVariation] = await db.query(
      `SELECT * FROM ${baseTable} AS i
      LEFT JOIN ${variationTable} AS iv 
      ON i.item_id = iv.item_id
      LEFT JOIN ${variationImageTable} AS ivi
      ON iv.item_variation_id = ivi.item_variation_id
      WHERE i.item_id = ?
      `, [itemId]
    );

    return res.json({
      success: true,
      message : "Single item data fetched successfully",
      item: itemDataWithVariation
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Endpoint to edit item data

// Admin functionality endpoints ends here

app.get("/vsa/:policyType", async (req, res) => {
  const { policyType } = req.params;
  const config = staticContentConfig[policyType];

  if (!config) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid policy type" });
  }

  try {
    const [results] = await db.query(
      `SELECT * FROM ${config.table} ORDER BY ${config.orderBy} ASC`
    );
    if (config.useWrappedResponse) {
      res.json({ success: true, data: results });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(`Error fetching ${policyType}:`, error);

    if (config.useWrappedResponse) {
      res.status(500).json({ success: false, message: config.errorMessage });
    } else {
      res.status(500).json({ error: config.errorMessage });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

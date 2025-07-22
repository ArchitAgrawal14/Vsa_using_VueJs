import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './db.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import nodemailer from 'nodemailer';
import * as middlewares from './middleware.js';
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

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

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  userProfileURL: process.env.USER_PROFILE_URL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile);
    
    // Check if user exists
    const [duplicateCheck] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [profile.emails[0].value]
    );

    let user;
    if (duplicateCheck.length > 0) {
      // Existing user
      user = duplicateCheck[0];
      
      // Update last login
      await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    } else {
      // New user - create account
      const userId = uuidv4();
      const [newUserResult] = await db.query(
        "INSERT INTO users (user_id, full_name, email, password, is_verified, created_by) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userId,
          profile.displayName,
          profile.emails[0].value,
          "google_oauth", // Password placeholder for Google users
          true, // Auto-verify Google users
          "google_oauth"
        ]
      );
      
      // Get the newly inserted user
      const [newUser] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [newUserResult.insertId]
      );
      user = newUser[0];
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin === 1,
      firstName: user.full_name.split(" ")[0],
    }, JWT_SECRET, { expiresIn: '1d' });

    const refreshToken = jwt.sign({
      userId: user.id
    }, JWT_SECRET, { expiresIn: '7d' });

    // Log successful login
    await db.query(
      'INSERT INTO login_logs (user_id, email, success) VALUES (?, ?, ?)',
      [user.id, user.email, true]
    );

    return done(null, { user, token, refreshToken });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return done(error);
  }
}));

app.post('/vsa/signup', middlewares.validateSignup, middlewares.handleValidationErrors, async (req,res) => {
  try {
    const {email, password, fullName, mobile, confirmPassword} = req.body;    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^(\+?\d{1,4}[-\s]?)?\d{6,14}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;

    console.log(`email: ${email}
      password: ${password}
      fullName: ${fullName}
      mobile: ${mobile}`);

    if(!emailRegex.test(email)){
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Use format like "+1234567890" or "1234567890" with 6–14 digits.'
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long and contain both letters and numbers.'
      });
    }

    if(password !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm password field should be same.'
      });
    }

    const [userDuplicacyCheck] = await db.query('SELECT * FROM users WHERE email = ?',[email]);
    if(userDuplicacyCheck.length > 0){
      const user=userDuplicacyCheck[0];
      console.log("User already exist",user.email, user.password, user.full_name, user.mobile);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email, login to continue'
      });
    }

    const saltRounds = 12;
    const userId = uuidv4();
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const firstName = fullName.split(' ')[0];

    await db.query(
      'INSERT INTO users (user_id, full_name, mobile, email, password) VALUES (?, ?, ?, ?, ?)',
      [userId, fullName, mobile, email, hashedPassword]
    );


    verifyUserEmail(email);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! We have sent a verification link click and login to continue.',
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

app.post('/vsa/login', middlewares.validateLogin, middlewares.handleValidationErrors, async (req,res) => {
  try{
  const {email, password ,captcha} = req.body;

  if(email == null || password == null || captcha == null){
    return res.status(401).json({
        success: false,
        message: 'Fields cannot be empty, Please fill in valid values'
      });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  const [userCheck] = await db.query('SELECT * FROM users WHERE email = ?',[email]);
  
  if(userCheck.length > 0){
    const user = userCheck[0];

    if(user.is_verified !== 1){
      verifyUserEmail(email);
      return res.status(400).json({
      success: false,
      message: 'User is not verified, Check email and click the verification link'
    });
    }
    
    if(user.is_admin === 1){
      return await isUserAdmin(password, user, true, res);
    } else {
      return await isUserAdmin(password, user, false, res);
    }
  }else {
    await db.query(
        'INSERT INTO login_logs (user_id, email, success, failure_reason) VALUES (?, ?, ?, ?)',
        [user?.id || null, email, false, 'User does not exists']
    );

    return res.status(401).json({
          success: false,
          message: 'User does not exist , Please Sign up to continue your journey'
    });
  }
}catch (error) {
    console.error('Login error:', error);
    await db.query(
        'INSERT INTO login_logs (user_id, email, success, failure_reason) VALUES (?, ?, ?, ?)',
        [user?.id || null, email, false, 'Internal server error']
    );
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

async function verifyUserEmail(email) {
// Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const [userCheck] = await db.query('SELECT * FROM users WHERE email=?',[email]);

      if(userCheck.length > 0){
        const user = userCheck[0];
        await db.query('UPDATE users SET verification_token = ? WHERE email = ?',[verificationToken, user.email]);
      }

      const verificationLink = `http://localhost:3000/vsa/verify-email?token=${verificationToken}`;
      // const verificationLink = `https://vaibhavskatingacademy.com/vsa/verify-email?token=${verificationToken}`;

      const firstName = userCheck[0].full_name.split(' ')[0];
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

async function isUserAdmin (password, user, isAdmin, res) {
const passwordValidation = await bcrypt.compare(password, user.password);

      if (!passwordValidation) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      await db.query('UPDATE users SET last_login = NOW() WHERE id = ?',[user.id]);

      const token = jwt.sign({
        userId : user.id,
        email : user.email,
        isAdmin : isAdmin,
        firstName : user.full_name.split(" ")[0],
      },
        JWT_SECRET,
        { expiresIn : '1d'}
      );
      const refreshToken = jwt.sign({
        userId: user.id
      }, JWT_SECRET, { expiresIn: '7d' });

      await db.query(
        'INSERT INTO login_logs (user_id, email, success) VALUES (?, ?, ?)',
        [user?.id || null, email, true]
      );

      res.json({
        success : true,
        message : 'Login successful , Welcome back',
        data : {
          token,
          refreshToken,
          user : {
            id : user.id,
            fullName : user.full_name,
            email : user.email,
            isAdmin : isAdmin,
            mobile : user.mobile
          }
        }
      });
}

app.post('/vsa/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const [userCheck] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (userCheck.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const user = userCheck[0];
    const newToken = jwt.sign({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin === 1,
      firstName: user.full_name.split(" ")[0],
    }, JWT_SECRET, { expiresIn: '15m' });

    const newRefreshToken = jwt.sign({
      userId: user.id
    }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
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
      return res.redirect(`${process.env.BASE_URL}/login?verified=error&message=${encodeURIComponent('Email verification failed. Invalid or expired token.')}`);
    }

    const user = users[0];

    if (user.is_verified) {
      // User already verified
      return res.redirect(`${process.env.BASE_URL}/login?verified=info&message=${encodeURIComponent('Your email is already verified. Please log in.')}`);
    }

    // User found and not verified – verify now
    await db.query(
      `UPDATE users SET is_verified = TRUE WHERE verification_token = ?`,
      [token]
    );

    return res.redirect(`${process.env.BASE_URL}/login?verified=success&message=${encodeURIComponent('Your email has been verified successfully! You can now log in.')}`);
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.redirect(`${process.env.BASE_URL}/login?verified=error&message=${encodeURIComponent('Email verification failed. Please try again.')}`);
  }
});

app.get("/vsa/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback route
app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      // For Vue.js, we'll redirect to a special page that handles the token
      const { token, refreshToken, user } = req.user;
      
      // Create a temporary token for the frontend to retrieve
      const tempToken = jwt.sign({
        token,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          isAdmin: user.is_admin === 0,
          mobile: user.mobile || ''
        }
      }, JWT_SECRET, { expiresIn: '5m' }); // Short-lived token for data transfer
      
      // Redirect to Vue.js frontend with the temporary token
      res.redirect(`http://localhost:8080/auth/google/success?token=${tempToken}`);
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect('/login?error=callback_failed');
    }
  }
);

// API endpoint to exchange temporary token for actual auth data
app.post('/vsa/google-auth-exchange', async (req, res) => {
  try {
    const { tempToken } = req.body;
    
    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: 'Temporary token is required'
      });
    }

    // Verify and decode the temporary token
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    
    res.json({
      success: true,
      message: 'Google Sign-In successful! Welcome back',
      data: {
        token: decoded.token,
        refreshToken: decoded.refreshToken,
        user: decoded.user
      }
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

app.get('/vsa/faq', async (req, res) => {
  try {
    const [faqs] = await db.query('SELECT * FROM faqs ORDER BY id ASC');
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.get('/vsa/privacy-policy', async (req, res) => {
  try {
    const [policies] = await db.query('SELECT * FROM privacy_policies ORDER BY id ASC');
    res.json(policies);
  } catch (err) {    
    res.status(500).json({ error: 'Failed to fetch privacy policy' });
  }
});

app.get('/vsa/refund-policy', async (req, res) => {
  try {
    const [refunds] = await db.query('SELECT * FROM refund_policies ORDER BY id ASC');
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch refund policy' });
  }
});

app.get('/vsa/return-policy', async (req, res) => {
  try {
    const [returnPolicy] = await db.query('SELECT * FROM return_policies ORDER BY step_number ASC');
    res.json(returnPolicy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch return policy' });
  }
});

app.get('/vsa/shipping-policy', async (req, res) => {
  try {
    const [shippingPolicies] = await db.query('SELECT * FROM shipping_policies ORDER BY id ASC');
    res.json(shippingPolicies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipping policy' });
  }
});

app.get('/vsa/terms-conditions', async (req, res) => {
  try {
    const [terms] = await db.query('SELECT * FROM terms_and_conditions ORDER BY id ASC');
    res.json(terms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch terms and conditions' });
  }
});

app.get('/vsa/cancellation-refunds', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM cancellation_refunds ORDER BY id ASC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/vsa/newsletter-subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const checkEmailQuery = 'SELECT id FROM newsletter_subscribers WHERE email = ?';
    const [existingEmail] = await db.query(checkEmailQuery, [email]);

    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    const insertQuery = `
      INSERT INTO newsletter_subscribers (email, subscribed_at, status) 
      VALUES (?, NOW(), 'active')
    `;
    
    await db.query(insertQuery, [email]);
    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

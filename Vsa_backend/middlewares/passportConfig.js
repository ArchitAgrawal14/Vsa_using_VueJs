import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;

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
      const [newUserResult] = await db.query(
        "INSERT INTO users (full_name, email, password, is_verified, created_by) VALUES (?, ?, ?, ?, ?)",
        [
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
      isAdmin: user.is_admin === 0,
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
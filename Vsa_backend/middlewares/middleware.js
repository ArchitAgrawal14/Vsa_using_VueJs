import { body, validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET;

// Validation middleware
const validateSignup = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters long'),
  body('mobile').isMobilePhone().withMessage('Please enter a valid mobile number'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Add this middleware function
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Try re-login or login to continue'
    });
  }
};

// Middleware to convert uploaded files to WebP and save to disk
const convertToWebP = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) return next();

  try {
    for (const fieldName of Object.keys(req.files)) {
      const fileArray = req.files[fieldName];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const timestamp = Date.now();
        const newFilename = `student-${timestamp}-${i}-${fieldName}.webp`;
        const outputPath = path.join(process.cwd(), "public/images/students", newFilename);
        await sharp(file.buffer)
          .webp({
            quality: 85,        // 85 gives great quality with ~70% size reduction
            lossless: false,    // Set true if you want truly lossless (larger files)
            effort: 4,          // 0-6, higher = better compression but slower (4 is balanced)
          })
          .toFile(outputPath);

        // Mutate the file object so downstream code (admin.js) sees the new filename
        file.filename = newFilename;
        file.path = outputPath;
        file.mimetype = "image/webp";
      }
    }
    next();
  } catch (error) {
    console.error("WebP conversion failed:", error);
    return res.status(500).json({
      success: false,
      message: "Image processing failed during upload",
    });
  }
};


export {validateLogin, validateSignup, verifyToken, handleValidationErrors, convertToWebP} ;
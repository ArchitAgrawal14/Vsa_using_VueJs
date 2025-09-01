import { body, validationResult } from 'express-validator';
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
  }),
  body('captcha').notEmpty().withMessage('CAPTCHA is required')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  body('captcha').notEmpty().withMessage('CAPTCHA is required')
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
  console.log('token' + token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    console.log("             ___________________");
    console.log('JWT ' +  JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("___________________", JSON.stringify(decoded, null, 2));
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export {validateLogin, validateSignup, verifyToken, handleValidationErrors} ;
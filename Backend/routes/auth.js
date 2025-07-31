const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { db } = require('../utils/supabase');
const User = require('../models/User');
const { auth, validate, handleAsync } = require('../middleware');

const router = express.Router();

// Register
router.post('/register', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('display_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters')
], validate, handleAsync(async (req, res) => {
  const { email, password, display_name } = req.body;

  // Check if user already exists
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      error: 'User with this email already exists'
    });
  }

  // Hash password
  const password_hash = await User.hashPassword(password);

  // Create new user
  const user = await db.createUser({
    email,
    password_hash,
    display_name
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    user: User.sanitizeUser(user),
    token
  });
}));

// Login
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], validate, handleAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      error: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordValid = await User.comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.json({
    message: 'Login successful',
    user: User.sanitizeUser(user),
    token
  });
}));

// Get current user
router.get('/me', auth, handleAsync(async (req, res) => {
  res.json({
    user: req.user
  });
}));

// Update user profile
router.put('/profile', auth, [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean value')
], validate, handleAsync(async (req, res) => {
  const { displayName, preferences } = req.body;
  const updates = {};

  if (displayName) updates.display_name = displayName;
  if (preferences) {
    updates.preferences = { ...req.user.preferences, ...preferences };
  }

  const user = await db.updateUser(req.user.id, updates);

  res.json({
    message: 'Profile updated successfully',
    user: User.sanitizeUser(user)
  });
}));

// Change password
router.put('/password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], validate, handleAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get current user with password hash
  const user = await db.getUserByEmail(req.user.email);
  
  // Verify current password
  const isCurrentPasswordValid = await User.comparePassword(currentPassword, user.password_hash);
  
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      error: 'Current password is incorrect'
    });
  }

  // Hash new password
  const password_hash = await User.hashPassword(newPassword);

  // Update password
  await db.updateUser(req.user.id, { password_hash });

  res.json({
    message: 'Password changed successfully'
  });
}));

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
});

module.exports = router; 
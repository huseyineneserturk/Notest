const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { db } = require('../utils/supabase');
const User = require('../models/User');
const { auth, validate, handleAsync } = require('../middleware');

const router = express.Router();

// Helper functions for statistics
const calculateStudyStreak = async (userId) => {
  try {
    const sixtyDaysAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000));
    const activity = await db.getUserActivityByDate(userId, sixtyDaysAgo);
    
    // Combine all activity dates
    const allDates = [
      ...activity.notes.map(n => new Date(n.created_at).toDateString()),
      ...activity.quizzes.map(q => new Date(q.created_at).toDateString())
    ];
    
    // Get unique dates and sort
    const uniqueDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
    
    if (uniqueDates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toDateString();
    
    // If no activity today, streak is 0
    if (uniqueDates[0] !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      if (uniqueDates[0] !== yesterday) return 0;
    }
    
    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const previous = new Date(uniqueDates[i - 1]);
      const diffTime = previous - current;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating study streak:', error);
    return 0;
  }
};

const calculateNotesGrowth = async (userId) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000));
    
    const recentCount = await db.getQuizCountByUserSince(userId, thirtyDaysAgo);
    const previousCount = await db.getQuizCountByUserSince(userId, sixtyDaysAgo) - recentCount;
    
    if (previousCount === 0) return recentCount > 0 ? 100 : 0;
    return Math.round(((recentCount - previousCount) / previousCount) * 100);
  } catch (error) {
    console.error('Error calculating notes growth:', error);
    return 0;
  }
};

const calculateQuizzesGrowth = async (userId) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    
    const thisMonthCount = await db.getQuizCountByUserSince(userId, thisMonth);
    const lastMonthCount = await db.getQuizCountByUserSince(userId, lastMonth) - thisMonthCount;
    
    if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
    return Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
  } catch (error) {
    console.error('Error calculating quizzes growth:', error);
    return 0;
  }
};

const calculateScoreGrowth = async (userId) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000));
    
    const recentResults = await db.getQuizResultsByUserSince(userId, thirtyDaysAgo);
    const previousResults = await db.getQuizResultsByUserSince(userId, sixtyDaysAgo);
    
    // Get results from 30-60 days ago (previous period)
    const olderResults = previousResults.filter(r => 
      new Date(r.created_at) < thirtyDaysAgo
    );
    
    const recentAvg = recentResults.length > 0 
      ? recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length 
      : 0;
    
    const previousAvg = olderResults.length > 0 
      ? olderResults.reduce((sum, r) => sum + r.score, 0) / olderResults.length 
      : 0;
    
    if (previousAvg === 0) return recentAvg > 0 ? 100 : 0;
    return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  } catch (error) {
    console.error('Error calculating score growth:', error);
    return 0;
  }
};

// Debug: Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth route is working!',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/auth/me',
      'GET /api/auth/stats',
      'GET /api/auth/performance',
      'GET /api/auth/test'
    ]
  });
});

// Get user statistics
router.get('/stats', auth, handleAsync(async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get total notes count
    const totalNotes = await db.getNoteCountByUser(userId);
    
    // Get quizzes taken this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const quizzesThisMonth = await db.getQuizCountByUserSince(userId, startOfMonth);
    
    // Get quiz results for average score (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentQuizResults = await db.getQuizResultsByUserSince(userId, thirtyDaysAgo);
    
    const averageScore = recentQuizResults.length > 0 
      ? Math.round(recentQuizResults.reduce((sum, result) => sum + result.score, 0) / recentQuizResults.length)
      : 0;
    
    // Calculate study streak (consecutive days with activity)
    const studyStreak = await calculateStudyStreak(userId);
    
    res.json({
      totalNotes,
      quizzesThisMonth,
      averageScore,
      studyStreak,
      trends: {
        notesGrowth: await calculateNotesGrowth(userId),
        quizzesGrowth: await calculateQuizzesGrowth(userId),
        scoreGrowth: await calculateScoreGrowth(userId),
        streakGrowth: 15 // Placeholder for streak growth
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics'
    });
  }
}));

// Get user performance history
router.get('/performance', auth, handleAsync(async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get quiz results with notebook and note information
    const quizHistory = await db.getQuizHistoryByUser(userId);
    
    // Group by notebook for performance chart
    const performanceByNotebook = {};
    
    quizHistory.forEach(result => {
      const notebookName = result.notebook_title || 'Unknown Notebook';
      if (!performanceByNotebook[notebookName]) {
        performanceByNotebook[notebookName] = [];
      }
      performanceByNotebook[notebookName].push(result.score);
    });
    
    // Calculate average scores per notebook
    const performanceData = Object.keys(performanceByNotebook).map(notebookName => ({
      name: notebookName,
      score: Math.round(
        performanceByNotebook[notebookName].reduce((sum, score) => sum + score, 0) 
        / performanceByNotebook[notebookName].length
      )
    }));
    
    res.json({
      quizHistory: quizHistory.map(result => ({
        id: result.id,
        notebook: result.notebook_title || 'Unknown Notebook',
        noteTitle: result.note_title || 'Unknown Note',
        date: result.created_at,
        score: `${result.score}%`,
        passed: result.passed,
        totalQuestions: result.total_questions
      })),
      performanceData
    });
  } catch (error) {
    console.error('Error fetching performance history:', error);
    res.status(500).json({
      error: 'Failed to fetch performance history'
    });
  }
}));

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
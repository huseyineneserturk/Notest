const express = require('express');
const { body, query } = require('express-validator');
const { db } = require('../utils/supabase');
const { auth, validate, handleAsync } = require('../middleware');

const router = express.Router();

// Get all notebooks for user
router.get('/', auth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  query('search')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Search term cannot be empty')
], validate, handleAsync(async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  const offset = (page - 1) * limit;

  // Get notebooks for user
  const notebooks = await db.getNotebooks(req.user.id);

  // Filter by category and search if provided
  let filteredNotebooks = notebooks;
  
  if (category) {
    filteredNotebooks = filteredNotebooks.filter(nb => nb.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredNotebooks = filteredNotebooks.filter(nb => 
      nb.title.toLowerCase().includes(searchLower) ||
      (nb.description && nb.description.toLowerCase().includes(searchLower))
    );
  }

  // Apply pagination
  const total = filteredNotebooks.length;
  const paginatedNotebooks = filteredNotebooks.slice(offset, offset + parseInt(limit));

  res.json({
    notebooks: paginatedNotebooks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single notebook
router.get('/:id', auth, handleAsync(async (req, res) => {
  const notebook = await db.getNotebookById(req.params.id);

  if (!notebook || notebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  res.json({
    notebook
  });
}));

// Create new notebook
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], validate, handleAsync(async (req, res) => {
  const { title, description, category, color, tags } = req.body;

  const notebook = await db.createNotebook({
    title,
    description,
    category,
    color,
    tags,
    user_id: req.user.id
  });

  res.status(201).json({
    message: 'Notebook created successfully',
    notebook
  });
}));

// Update notebook
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], validate, handleAsync(async (req, res) => {
  const { title, description, category, color, tags } = req.body;

  // Check if notebook exists and belongs to user
  const existingNotebook = await db.getNotebookById(req.params.id);
  if (!existingNotebook || existingNotebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;
  if (color !== undefined) updates.color = color;
  if (tags !== undefined) updates.tags = tags;

  const notebook = await db.updateNotebook(req.params.id, updates);

  res.json({
    message: 'Notebook updated successfully',
    notebook
  });
}));

// Delete notebook
router.delete('/:id', auth, handleAsync(async (req, res) => {
  // Check if notebook exists and belongs to user
  const existingNotebook = await db.getNotebookById(req.params.id);
  if (!existingNotebook || existingNotebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  await db.deleteNotebook(req.params.id);

  res.json({
    message: 'Notebook deleted successfully'
  });
}));

// Get notebook stats
router.get('/:id/stats', auth, handleAsync(async (req, res) => {
  const notebook = await db.getNotebookById(req.params.id);

  if (!notebook || notebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  res.json({
    stats: notebook.stats
  });
}));

module.exports = router; 
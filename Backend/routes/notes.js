const express = require('express');
const { body, query } = require('express-validator');
const { db } = require('../utils/supabase');
const { auth, validate, handleAsync } = require('../middleware');

const router = express.Router();

// Get all notes for a notebook
router.get('/notebook/:notebookId', auth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('search')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Search term cannot be empty'),
  query('archived')
    .optional()
    .isBoolean()
    .withMessage('Archived must be a boolean value')
], validate, handleAsync(async (req, res) => {
  const { notebookId } = req.params;
  const { page = 1, limit = 20, search, archived } = req.query;
  const offset = (page - 1) * limit;

  // Verify notebook belongs to user
  const notebook = await db.getNotebookById(notebookId);
  if (!notebook || notebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  // Get notes for notebook
  const notes = await db.getNotesByNotebook(notebookId);

  // Filter by search and archived status
  let filteredNotes = notes;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredNotes = filteredNotes.filter(note => 
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  }
  
  if (archived !== undefined) {
    const isArchived = archived === 'true';
    filteredNotes = filteredNotes.filter(note => note.is_archived === isArchived);
  }

  // Apply pagination
  const total = filteredNotes.length;
  const paginatedNotes = filteredNotes.slice(offset, offset + parseInt(limit));

  res.json({
    notes: paginatedNotes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single note
router.get('/:id', auth, handleAsync(async (req, res) => {
  const note = await db.getNoteById(req.params.id);

  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  res.json({ note });
}));

// Create note
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('notebookId')
    .notEmpty()
    .withMessage('Notebook ID is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], handleAsync(async (req, res) => {
  console.log('Creating note with data:', req.body);
  const { title, content, notebookId, tags } = req.body;

  // Verify notebook belongs to user
  const notebook = await db.getNotebookById(notebookId);
  if (!notebook || notebook.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Notebook not found'
    });
  }

  const note = await db.createNote({
    title,
    content,
    notebook_id: notebookId,
    user_id: req.user.id,
    tags
  });

  res.status(201).json({
    message: 'Note created successfully',
    note
  });
}));

// Update note
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], validate, handleAsync(async (req, res) => {
  const { title, content, tags } = req.body;

  // Check if note exists and belongs to user
  const existingNote = await db.getNoteById(req.params.id);
  if (!existingNote || existingNote.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (tags !== undefined) updates.tags = tags;

  const note = await db.updateNote(req.params.id, updates);

  res.json({
    message: 'Note updated successfully',
    note
  });
}));

// Delete note
router.delete('/:id', auth, handleAsync(async (req, res) => {
  // Check if note exists and belongs to user
  const existingNote = await db.getNoteById(req.params.id);
  if (!existingNote || existingNote.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  await db.deleteNote(req.params.id);

  res.json({
    message: 'Note deleted successfully'
  });
}));

// Archive/unarchive note
router.patch('/:id/archive', auth, [
  body('isArchived')
    .isBoolean()
    .withMessage('isArchived must be a boolean value')
], validate, handleAsync(async (req, res) => {
  const { isArchived } = req.body;

  // Check if note exists and belongs to user
  const existingNote = await db.getNoteById(req.params.id);
  if (!existingNote || existingNote.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  const note = await db.updateNote(req.params.id, { is_archived: isArchived });

  res.json({
    message: `Note ${isArchived ? 'archived' : 'unarchived'} successfully`,
    note
  });
}));

// Search notes
router.get('/search', auth, [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], validate, handleAsync(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  // Get all user's notes
  const allNotes = await db.getNotesByUser(req.user.id);

  // Filter by search query
  const searchLower = q.toLowerCase();
  const filteredNotes = allNotes.filter(note => 
    note.title.toLowerCase().includes(searchLower) ||
    note.content.toLowerCase().includes(searchLower) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchLower)))
  );

  // Apply pagination
  const total = filteredNotes.length;
  const paginatedNotes = filteredNotes.slice(offset, offset + parseInt(limit));

  res.json({
    notes: paginatedNotes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get note versions
router.get('/:id/versions', auth, handleAsync(async (req, res) => {
  // Check if note exists and belongs to user
  const existingNote = await db.getNoteById(req.params.id);
  if (!existingNote || existingNote.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  const versions = await db.getNoteVersions(req.params.id);

  res.json({
    versions
  });
}));

module.exports = router; 
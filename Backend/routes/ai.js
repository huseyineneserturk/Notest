const express = require('express');
const { body } = require('express-validator');
const { db } = require('../utils/supabase');
const { auth, validate, handleAsync } = require('../middleware');
const { generateSummary, generateChatResponse, generateQuiz } = require('../utils/ai');

const router = express.Router();

// Generate summary for a note
router.post('/summary', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required')
], validate, handleAsync(async (req, res) => {
  const { noteId } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Generate summary using AI
  const summary = await generateSummary(note.content);

  res.json({
    summary
  });
}));

// Chat with AI about a note
router.post('/chat', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
], validate, handleAsync(async (req, res) => {
  const { noteId, message } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Generate chat response using AI
  const response = await generateChatResponse(note.content, message);

  res.json({
    response
  });
}));

// Get AI suggestions for note improvement
router.post('/suggestions', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required')
], validate, handleAsync(async (req, res) => {
  const { noteId } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // This would use a more sophisticated AI prompt to analyze the note
  // and provide suggestions for improvement
  const suggestions = {
    structure: [
      'Consider adding more headings to organize your content',
      'Break down long paragraphs into smaller, digestible sections'
    ],
    content: [
      'Add more examples to illustrate key concepts',
      'Include definitions for technical terms'
    ],
    completeness: [
      'Consider adding a conclusion section',
      'Include references or sources for key information'
    ]
  };

  res.json({
    suggestions
  });
}));

// Generate quiz from note content
router.post('/quiz', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required'),
  body('questionCount')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Question count must be between 1 and 20'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
], validate, handleAsync(async (req, res) => {
  const { noteId, questionCount = 5, difficulty = 'medium' } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Generate quiz using AI
  const quiz = await generateQuiz(note.content, questionCount, difficulty);

  res.json({
    quiz
  });
}));

// Generate flashcards from note content
router.post('/flashcards', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Count must be between 1 and 20')
], validate, handleAsync(async (req, res) => {
  const { noteId, count = 5 } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Generate flashcards using AI
  const flashcards = await generateFlashcards(note.content, count);

  res.json({
    flashcards
  });
}));

// Get readability analysis
router.post('/readability', auth, [
  body('noteId')
    .notEmpty()
    .withMessage('Note ID is required')
], validate, handleAsync(async (req, res) => {
  const { noteId } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Calculate readability metrics
  const readability = {
    wordCount: note.word_count || 0,
    readingTime: note.reading_time || 0,
    averageSentenceLength: 15, // This would be calculated
    complexity: 'Medium', // This would be calculated
    suggestions: [
      'Consider using shorter sentences for better readability',
      'Add more visual breaks with headings and bullet points'
    ]
  };

  res.json({
    readability
  });
}));

module.exports = router; 
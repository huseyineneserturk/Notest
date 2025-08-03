const express = require('express');
const { body, query } = require('express-validator');
const { db } = require('../utils/supabase');
const { auth, validate, handleAsync } = require('../middleware');
const { generateQuiz, generateExplanation } = require('../utils/ai');

const router = express.Router();

// Get all quizzes for a note
router.get('/note/:noteId', auth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], validate, handleAsync(async (req, res) => {
  const { noteId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Verify note belongs to user
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  const quizzes = await db.getQuizzesByNote(noteId);
  const total = quizzes.length;
  const paginatedQuizzes = quizzes.slice(offset, offset + parseInt(limit));

  res.json({
    quizzes: paginatedQuizzes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single quiz
router.get('/:id', auth, handleAsync(async (req, res) => {
  const quiz = await db.getQuizById(req.params.id);

  if (!quiz || quiz.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Quiz not found'
    });
  }

  res.json({ quiz });
}));

// Create quiz from note content
router.post('/generate', auth, [
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
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
], validate, handleAsync(async (req, res) => {
  const { noteId, questionCount = 5, difficulty = 'medium', title } = req.body;

  // Get note
  const note = await db.getNoteById(noteId);
  if (!note || note.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Note not found'
    });
  }

  // Generate quiz using AI
  const quizData = await generateQuiz(note.content, questionCount, difficulty);
  
  const quiz = await db.createQuiz({
    title: title || `Quiz for ${note.title}`,
    note_id: noteId,
    user_id: req.user.id,
    questions: quizData.questions,
    settings: {
      timeLimit: 0,
      passingScore: 70,
      difficulty
    }
  });

  res.status(201).json({
    message: 'Quiz generated successfully',
    quiz
  });
}));

// Submit quiz answers
router.post('/:id/submit', auth, [
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  body('totalTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total time must be a positive integer')
], validate, handleAsync(async (req, res) => {
  const { answers, totalTime } = req.body;

  // Get quiz
  const quiz = await db.getQuizById(req.params.id);
  if (!quiz || quiz.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Quiz not found'
    });
  }

  // Calculate score
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;

  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= quiz.settings.passingScore;

  // Save result
  const result = await db.submitQuizResult({
    quiz_id: quiz.id,
    user_id: req.user.id,
    answers,
    score,
    total_questions: totalQuestions,
    passed,
    total_time: totalTime
  });

  // Update quiz stats
  await db.updateQuizStats(quiz.id, score);

  res.json({
    message: 'Quiz submitted successfully',
    result,
    score,
    passed
  });
}));

// Get quiz results
router.get('/:id/results', auth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], validate, handleAsync(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Verify quiz belongs to user
  const quiz = await db.getQuizById(id);
  if (!quiz || quiz.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Quiz not found'
    });
  }

  const results = await db.getQuizResults(id);
  const total = results.length;
  const paginatedResults = results.slice(offset, offset + parseInt(limit));

  res.json({
    results: paginatedResults,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get explanation for a question
router.post('/:id/explanation', auth, [
  body('questionIndex')
    .isInt({ min: 0 })
    .withMessage('Question index must be a non-negative integer'),
  body('userAnswer')
    .notEmpty()
    .withMessage('User answer is required')
], validate, handleAsync(async (req, res) => {
  const { questionIndex, userAnswer } = req.body;

  // Get quiz
  const quiz = await db.getQuizById(req.params.id);
  if (!quiz || quiz.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Quiz not found'
    });
  }

  if (questionIndex >= quiz.questions.length) {
    return res.status(400).json({
      error: 'Invalid question index'
    });
  }

  const question = quiz.questions[questionIndex];
  const explanation = await generateExplanation(question, userAnswer);

  res.json({
    explanation
  });
}));

// Delete quiz
router.delete('/:id', auth, handleAsync(async (req, res) => {
  // Check if quiz exists and belongs to user
  const existingQuiz = await db.getQuizById(req.params.id);
  if (!existingQuiz || existingQuiz.user_id !== req.user.id) {
    return res.status(404).json({
      error: 'Quiz not found'
    });
  }

  await db.deleteQuiz(req.params.id);

  res.json({
    message: 'Quiz deleted successfully'
  });
}));

module.exports = router; 
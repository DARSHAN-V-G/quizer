const express = require('express');
const { createQuiz, takeQuiz, getLeaderboard,submitAnswers } = require('../controllers/quizController');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST api/quiz/create
// @desc    Create a quiz
// @access  Private
router.post('/create', auth, createQuiz);

// @route   POST api/quiz/take
// @desc    Take a quiz
// @access  Public
router.post('/take', takeQuiz);

// @route   GET api/quiz/leaderboard/:code
// @desc    Get leaderboard for a quiz
// @access  Public
router.get('/leaderboard/:code', getLeaderboard);

router.post('/submit', auth, submitAnswers);
module.exports = router;

const express = require('express');
const { createQuiz, takeQuiz, getLeaderboard,submitAnswers } = require('../controllers/quizController');
const auth = require('../middleware/auth');
const router = express.Router();
router.post('/create', auth, createQuiz);
router.post('/take', takeQuiz);
router.get('/leaderboard/:code', getLeaderboard);
router.post('/submit', auth, submitAnswers);
module.exports = router;

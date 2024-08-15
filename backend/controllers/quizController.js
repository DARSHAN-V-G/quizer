const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.createQuiz = async (req, res) => {
  const { code, questions } = req.body;
  const userId = req.user.id;

  try {
    let quiz = await Quiz.findOne({ code });
    if (quiz) {
      return res.status(400).json({ msg: 'Quiz code already exists' });
    }

    quiz = new Quiz({
      code,
      creator: userId,
      questions,
    });

    await quiz.save();
    res.json({ msg: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.takeQuiz = async (req, res) => {
  const { code } = req.body;

  try {
    let quiz = await Quiz.findOne({ code });
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLeaderboard = async (req, res) => {
    const { code } = req.params;
  
    try {
      let quiz = await Quiz.findOne({ code })
        .populate('creator', 'name')
        .populate('participants.user', 'name');
  
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }
  
      // Sort participants by score in descending order
      quiz.participants.sort((a, b) => b.score - a.score);
  
      res.json({ leaderboard: quiz.participants });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

exports.submitAnswers = async (req, res) => {
    const { code, answers } = req.body;
    const userId = req.user.id;
  
    try {
      let quiz = await Quiz.findOne({ code });
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }
  
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (question.correctOption === answers[index]) {
          score += question.points;
        }
      });
  
      // Check if the user has already participated
      const participant = quiz.participants.find(participant => participant.user.toString() === userId);
      if (participant) {
        return res.status(400).json({ msg: 'You have already participated in this quiz' });
      }
  
      // Update leaderboard
      quiz.participants.push({ user: userId, score });
      await quiz.save();
  
      res.json({ msg: 'Quiz submitted successfully', score });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
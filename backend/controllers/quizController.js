const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.createQuiz = async (req, res) => {
  const { code, questions } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!code || !questions) {
    return res.status(400).json({ msg: 'Please provide a quiz code and questions' });
  }

  if (typeof code !== 'string' || code.length === 0) {
    return res.status(400).json({ msg: 'Quiz code must be a non-empty string' });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ msg: 'Questions must be a non-empty array' });
  }

  for (const question of questions) {
    if (!question.text || !question.options || !question.correctOption || !question.points) {
      return res.status(400).json({ msg: 'Each question must have text, options, correctOption, and points' });
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      return res.status(400).json({ msg: 'Each question must have at least two options' });
    }
    if (typeof question.correctOption !== 'number' || question.correctOption < 0 || question.correctOption >= question.options.length) {
      return res.status(400).json({ msg: 'Correct option must be a valid index' });
    }
    if (typeof question.points !== 'number' || question.points <= 0) {
      return res.status(400).json({ msg: 'Points must be a positive number' });
    }
  }

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
    res.status(201).json({ msg: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.takeQuiz = async (req, res) => {
  const { code } = req.body; // Changed to req.params for consistency, assuming code is in URL

  // Validate input
  if (!code) {
    return res.status(400).json({ msg: 'Please provide a quiz code' });
  }

  try {
    let quiz = await Quiz.findOne({ code }).select('-questions.correctOption'); // Exclude correct answers
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Remove correctOption from each question before sending
    const quizForTaking = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => {
        const { correctOption, ...questionWithoutCorrectOption } = q;
        return questionWithoutCorrectOption;
      })
    };

    res.json({ quiz: quizForTaking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
    const { code } = req.params;

    // Validate input
    if (!code) {
      return res.status(400).json({ msg: 'Please provide a quiz code' });
    }
  
    try {
      let quiz = await Quiz.findOne({ code })
        .populate('creator', ['name', 'email']) // Include email for better identification
        .populate('participants.user', ['name', 'email']); // Include email for better identification
  
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }
  
      // Sort participants by score in descending order
      quiz.participants.sort((a, b) => b.score - a.score);
  
      res.json({ leaderboard: quiz.participants });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

exports.submitAnswers = async (req, res) => {
    const { code, answers } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!code || !answers) {
      return res.status(400).json({ msg: 'Please provide a quiz code and answers' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ msg: 'Answers must be an array' });
    }
  
    try {
      let quiz = await Quiz.findOne({ code });
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }

      if (answers.length !== quiz.questions.length) {
        return res.status(400).json({ msg: 'Number of answers does not match number of questions' });
      }
  
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        // Ensure answer is a number (index of the option)
        if (typeof answers[index] !== 'number' || answers[index] < 0 || answers[index] >= question.options.length) {
          // Potentially skip this question or mark as incorrect, depending on desired behavior
          // For now, we'll just not add points if the answer format is invalid
          return; 
        }
        if (question.correctOption === answers[index]) {
          score += question.points;
        }
      });
  
      // Check if the user has already participated
      const participantIndex = quiz.participants.findIndex(participant => participant.user.toString() === userId);
      
      if (participantIndex > -1) {
        // If user already participated, update their score if the new one is higher (optional behavior)
        // For now, let's prevent re-submission or update if score is higher.
        // If you want to allow re-submission and update score:
        // if (score > quiz.participants[participantIndex].score) {
        //   quiz.participants[participantIndex].score = score;
        // } else {
        //   return res.status(400).json({ msg: 'New score is not higher than the previous one' });
        // }
        return res.status(400).json({ msg: 'You have already participated in this quiz' });
      } else {
        quiz.participants.push({ user: userId, score });
      }
  
      await quiz.save();
  
      res.json({ msg: 'Quiz submitted successfully', score });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
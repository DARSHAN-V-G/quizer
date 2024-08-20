import React from 'react';
import QuizForm from '../components/QuizForm';
import axios from 'axios';
const CreateQuiz = () => {
  const handleCreateQuiz = async (quizData) => {
    try {
      await axios.post('/api/quiz/create', quizData);
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return <QuizForm onSubmit={handleCreateQuiz} />;
};

export default CreateQuiz;

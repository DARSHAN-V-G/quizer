import React, { useState, useEffect } from 'react';
import QuizForm from '../components/QuizForm.jsx'; // Ensure .jsx extension
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Automatically clear messages after a few seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleCreateQuiz = async (quizData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation for quizData structure (can be expanded in QuizForm.jsx)
    if (!quizData.code || !quizData.questions || quizData.questions.length === 0) {
      setError('Quiz code and at least one question are required.');
      setLoading(false);
      return;
    }
    // Add token to headers for authentication
    const token = localStorage.getItem('token');
    if (!token) {
        setError('You must be logged in to create a quiz.');
        setLoading(false);
        // Optional: redirect to login
        // navigate('/login'); 
        return;
    }
    const config = {
        headers: {
            'x-auth-token': token
        }
    };

    try {
      // Ensure the API endpoint matches your backend
      const response = await axios.post('/api/quiz/create', quizData, config); // Reverted API endpoint
      setSuccess(`Quiz "${response.data.quiz.code}" created successfully!`);
      // Optionally, navigate to the quiz list or the new quiz page
      // navigate(`/quiz/${response.data.quiz.code}`); 
      // For now, just show success message and let user decide next action
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err.response?.data?.msg || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create a New Quiz</h1>
      
      {error && (
        <div className="mb-4 p-3 text-center text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-center text-green-700 bg-green-100 border border-green-400 rounded-md">
          {success}
        </div>
      )}
      
      <div className="bg-white p-8 shadow-xl rounded-lg">
        <QuizForm 
          onSubmit={handleCreateQuiz} 
          isLoading={loading} 
          // Pass setLoading, setError, setSuccess if QuizForm needs to manage them directly for more granular feedback
        />
      </div>
    </div>
  );
};

export default CreateQuiz;

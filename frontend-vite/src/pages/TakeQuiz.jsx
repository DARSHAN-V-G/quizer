import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TakeQuiz = () => {
  const { code } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');
      try {
        // The backend expects GET /api/quiz/take/:code or similar, ensure your API endpoint is correct
        // Based on previous work, it might be /api/quizzes/take (or similar) and code might be a query param or part of path
        // For now, assuming the provided backend route `GET /api/quiz/take?code=${code}` is for createQuiz or similar
        // And the actual takeQuiz endpoint is /api/quizzes/${code} or /api/quiz/details/${code} (adjust as per your backend routes)
        // Let's assume the quiz fetching for taking is `GET /api/quizzes/code/${code}` as an example
        const response = await axios.get(`/api/quiz/take?code=${code}`); // Reverted API endpoint
        // Assuming the backend returns the quiz object directly as response.data
        // or response.data.quiz depending on the actual backend implementation from earlier.
        // The previous backend work for takeQuiz in quizController.js suggests it returns { quiz: quizForTaking }
        // So response.data.quiz should be correct. If it was just `res.json(quizForTaking)` then it would be `response.data`.
        // Sticking with response.data.quiz as per original frontend assumption.
        if (response.data && response.data.quiz) { 
          setQuiz(response.data.quiz); 
          const initialAnswers = {};
          response.data.quiz.questions.forEach(q => {
            initialAnswers[q._id] = null;
          });
          setAnswers(initialAnswers);
        } else if (response.data) { 
          // Fallback if the quiz object is directly in response.data (less likely given controller structure)
          setQuiz(response.data);
          const initialAnswers = {};
          response.data.questions.forEach(q => {
            initialAnswers[q._id] = null;
          });
          setAnswers(initialAnswers);
        } else {
          setError('Quiz data is not in the expected format or quiz not found.');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.response?.data?.msg || 'Failed to fetch quiz. Please check the code and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchQuiz();
    }
  }, [code]);

  const handleChange = (questionId, optionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionIndex, // Store the index of the selected option
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Transform answers into the format expected by the backend (array of selected option indices)
    const formattedAnswers = quiz.questions.map(question => answers[question._id]);

    // Check if all questions have been answered
    if (formattedAnswers.some(ans => ans === null || ans === undefined)) {
      setError('Please answer all questions before submitting.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/quiz/submit', { // Reverted API endpoint
        code,
        answers: formattedAnswers, // Send the array of indices
      });
      alert(`Quiz submitted successfully! Your score is: ${response.data.score}`);
      navigate(`/leaderboard/${code}`);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.response?.data?.msg || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading quiz...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  if (!quiz) {
    return <p className="text-center mt-8">Quiz not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{quiz.title || `Quiz ${quiz.code}`}</h1>
      <p className="mb-4 text-gray-700">Read each question carefully and select one option. Click "Submit Answers" when you're done.</p>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div key={question._id || qIndex} className="p-6 shadow-lg rounded-lg bg-white">
            <h4 className="text-xl font-semibold mb-4">{`Question ${qIndex + 1}: ${question.text}`}</h4>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-3 rounded-md border transition-all cursor-pointer
                              ${answers[question._id] === index ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={index} // Value is the index
                    checked={answers[question._id] === index}
                    onChange={() => handleChange(question._id, index)}
                    className="sr-only" // Hide the actual radio button, style the label instead
                  />
                  {option.text || option} {/* Assuming options might be objects or strings */}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </form>
    </div>
  );
};

export default TakeQuiz;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TakeQuiz = () => {
  const { code } = useParams(); // Extract quiz code from URL
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz/take?code=${code}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [code]);

  const handleChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/quiz/submit', {
        code,
        answers,
      });
      alert('Quiz submitted successfully! Your score is: ' + response.data.score);
      navigate(`/leaderboard/${code}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (!quiz) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question) => (
          <div key={question._id}>
            <h4>{question.question}</h4>
            {question.options.map((option, index) => (
              <div key={index}>
                <label>
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    onChange={() => handleChange(question._id, option)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit Answers</button>
      </form>
    </div>
  );
};

export default TakeQuiz;

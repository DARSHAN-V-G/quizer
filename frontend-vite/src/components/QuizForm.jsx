import React, { useState } from 'react';

const QuizForm = ({ onSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', ''], correctOption: 0, points: 10 },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      // value is an array of options for this case
      newQuestions[index].options = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', ''], correctOption: 0, points: 10 },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return; // Must have at least one question
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length < 6) { // Max 6 options
      newQuestions[qIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) { // Min 2 options
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, optIdx) => optIdx !== oIndex);
      // Adjust correctOption if it's out of bounds
      if (newQuestions[qIndex].correctOption >= newQuestions[qIndex].options.length) {
        newQuestions[qIndex].correctOption = newQuestions[qIndex].options.length - 1;
      }
      setQuestions(newQuestions);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation before submitting
    if (!code.trim()) {
      alert('Please provide a quiz code.'); // Replace with a more integrated error message if setError is passed
      return;
    }
    if (questions.some(q => !q.text.trim() || q.options.some(opt => !opt.trim()) || q.points <=0 )) {
      alert('Please ensure all questions have text, all options are filled, and points are positive.');
      return;
    }
    onSubmit({ code, questions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="quizCode" className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Code (e.g., MATH101)
        </label>
        <input
          type="text"
          id="quizCode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter a unique code for your quiz"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
          required
        />
      </div>

      {questions.map((q, qIndex) => (
        <fieldset key={qIndex} className="border border-gray-300 p-4 rounded-md space-y-3">
          <legend className="text-lg font-medium text-gray-900 px-2">Question {qIndex + 1}</legend>
          
          <button 
            type="button" 
            onClick={() => removeQuestion(qIndex)}
            disabled={isLoading || questions.length <= 1}
            className="float-right -mt-8 -mr-1 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded disabled:opacity-50"
          >
            Remove Question
          </button>

          <div>
            <label htmlFor={`qtext_${qIndex}`} className="block text-sm font-medium text-gray-700">Question Text</label>
            <input
              type="text"
              id={`qtext_${qIndex}`}
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
              placeholder="What is 2+2?"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center mt-1 space-x-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isLoading}
                  required
                />
                <input
                  type="radio"
                  name={`correctOpt_${qIndex}`}
                  checked={q.correctOption === oIndex}
                  onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                  disabled={isLoading}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                 <label className="text-sm text-gray-700">Correct</label>
                {q.options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(qIndex, oIndex)}
                    disabled={isLoading}
                    className="text-red-500 hover:text-red-700 text-sm p-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {q.options.length < 6 && (
                 <button 
                    type="button" 
                    onClick={() => addOption(qIndex)}
                    disabled={isLoading}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                    + Add Option
                </button>
            )}
          </div>

          <div>
            <label htmlFor={`qpoints_${qIndex}`} className="block text-sm font-medium text-gray-700">Points</label>
            <input
              type="number"
              id={`qpoints_${qIndex}`}
              value={q.points}
              min="1"
              onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value, 10))}
              className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>
        </fieldset>
      ))}

      <div className="flex justify-between items-center">
        <button 
          type="button" 
          onClick={addQuestion}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-50"
        >
          Add Another Question
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;

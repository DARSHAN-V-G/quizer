import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTitle, setQuizTitle] = useState(''); // Optional: fetch quiz title too
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { code } = useParams();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        // The backend sends { leaderboard: quiz.participants }
        // quiz.participants is an array of { user: { name: 'User Name', email: '...' }, score: 100, _id: ... }
        const response = await axios.get(`/api/quiz/leaderboard/${code}`);
        if (response.data && response.data.leaderboard) {
          setLeaderboard(response.data.leaderboard);
          // If you also want to display quiz title, the backend would need to send it.
          // For now, we'll just use the code.
          // setQuizTitle(response.data.quizTitle || code); 
        } else {
          setLeaderboard([]);
          setError('Leaderboard data is not in the expected format.');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.response?.data?.msg || 'Failed to fetch leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchLeaderboard();
    }
  }, [code]);

  if (loading) {
    return <p className="text-center mt-8 text-lg">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500 text-lg">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Leaderboard for Quiz: <span className="text-blue-600">{code}</span>
      </h1>
      
      {leaderboard.length === 0 && !loading && (
        <p className="text-center text-gray-600 text-lg">No participants yet for this quiz.</p>
      )}

      {leaderboard.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Rank</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Score</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {leaderboard.map((entry, index) => (
                <tr key={entry._id || index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-blue-100 transition-colors`}>
                  <td className="text-left py-3 px-4">{index + 1}</td>
                  <td className="text-left py-3 px-4">{entry.user ? entry.user.name : 'Anonymous'}</td>
                  <td className="text-left py-3 px-4 font-semibold">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { code } = useParams();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`/api/quiz/leaderboard/${code}`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [code]);

  return (
    <div>
      <h2>Leaderboard for Quiz: {code}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/create-quiz">Create Quiz</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

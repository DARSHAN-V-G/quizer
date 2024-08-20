import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Homepage.js';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateQuiz from './pages/CreateQuiz';
import Leaderboard from './pages/LeaderBoard';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz'; // Import TakeQuiz page

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/leaderboard/:code" element={<Leaderboard />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/take-quiz/:code" element={<TakeQuiz />} /> {/* Route for taking the quiz */}
      </Routes>
    </Router>
  );
};

export default App;

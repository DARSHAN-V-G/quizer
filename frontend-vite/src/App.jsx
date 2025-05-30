import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Home from './pages/Homepage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import CreateQuiz from './pages/CreateQuiz.jsx';
import Leaderboard from './pages/LeaderBoard.jsx';
import QuizList from './pages/QuizList.jsx';
import TakeQuiz from './pages/TakeQuiz.jsx';
import './App.css'; // Assuming App.css was copied

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
        <Route path="/take-quiz/:code" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
};

export default App;

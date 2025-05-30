import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Navbar = () => { // Removed latestQuizCode prop for now, can be added back if needed globally
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes to update login status (e.g. if token is removed by logout)
    const handleStorageChange = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsLoggedIn(false);
    setIsOpen(false); // Close menu on logout
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu when a link is clicked (for mobile)
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300">QuizApp</Link>
          
          {/* Hamburger button for mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            <li><Link to="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={handleLinkClick}>Home</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link to="/create" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={handleLinkClick}>Create Quiz</Link></li>
                <li><Link to="/quiz-list" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={handleLinkClick}>Take a Quiz</Link></li>
                {/* Add a generic leaderboard link or specific one if code is available */}
                {/* <li><Link to="/leaderboard/some-code" className="hover:text-gray-300">Leaderboard</Link></li> */}
                <li><button onClick={handleLogout} className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/register" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={handleLinkClick}>Register</Link></li>
                <li><Link to="/login" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" onClick={handleLinkClick}>Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <li><Link to="/" className="block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium" onClick={handleLinkClick}>Home</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link to="/create" className="block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium" onClick={handleLinkClick}>Create Quiz</Link></li>
                <li><Link to="/quiz-list" className="block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium" onClick={handleLinkClick}>Take a Quiz</Link></li>
                <li><button onClick={handleLogout} className="w-full text-left block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/register" className="block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium" onClick={handleLinkClick}>Register</Link></li>
                <li><Link to="/login" className="block hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium" onClick={handleLinkClick}>Login</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
// Need to import axios if not already globally available or pass as prop for handleLogout

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-green tracking-widest">
          DARKBAY-KMITL
        </Link>
        <div className="flex-1 max-w-lg mx-8">
          <input
            type="text"
            placeholder="Search for questionable textbooks..."
            className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-light-text focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        <nav className="flex items-center space-x-6 text-sm">
          {user ? (
            <>
              <Link to="/messages" className="hover:text-brand-green transition-colors">Messages</Link>
              <Link to="/dashboard" className="hover:text-brand-green transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-brand-green transition-colors">Logout</button>
              <span className="text-dark-text">|</span>
              <span className="font-bold text-light-text">{user.username}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="font-bold bg-brand-green text-dark-bg px-4 py-2 rounded-md hover:bg-brand-green-dark transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-brand-green transition-colors">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-card border border-dark-border rounded-lg shadow-green-glow">
        <h1 className="text-3xl font-bold text-center text-brand-green tracking-wider">DARKBAY-KMITL</h1>
        <p className="text-center text-medium-text">Enter the shadow marketplace of academic artifacts</p>
        
        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-2 rounded-md text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your alias..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Password</label>
            <input
              type="password"
              placeholder="Your secret incantation..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-medium-text cursor-pointer">
              <input type="checkbox" className="mr-2 h-4 w-4 text-brand-green bg-dark-bg border-dark-border focus:ring-brand-green" />
              Remember me (until graduation)
            </label>
            <a href="/login" className="text-sm text-brand-green hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-brand-green text-dark-bg font-bold py-3 rounded-md hover:bg-brand-green-dark transition-colors">
            --[ Enter the Matrix ]--
          </button>
        </form>
        <p className="text-center text-sm text-medium-text">
          Don't have an alias? <Link to="/register" className="text-brand-green hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
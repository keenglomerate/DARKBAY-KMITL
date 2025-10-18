import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match. Even in chaos, consistency matters.');
      return;
    }
    setError('');
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. The matrix has rejected you.');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-card border border-dark-border rounded-lg shadow-green-glow">
        <h1 className="text-3xl font-bold text-center text-brand-green tracking-wider">Join the Dark Side</h1>
        <p className="text-center text-medium-text">Create your alias to trade questionable artifacts.</p>

        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-2 rounded-md text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Username</label>
            <input type="text" placeholder="Choose your dark alias" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Email</label>
            <input type="email" placeholder="your.alias@it.kmitl.ac.th" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Password</label>
            <input type="password" placeholder="Create your secret key" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Confirm Password</label>
            <input type="password" placeholder="Confirm your incantation" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
          <button type="submit" className="w-full bg-brand-green text-dark-bg font-bold py-3 rounded-md hover:bg-brand-green-dark transition-colors">
            Forge Alliance
          </button>
        </form>
         <p className="text-center text-sm text-medium-text">
          Already have an alias? <Link to="/login" className="text-brand-green hover:underline">Enter the Matrix</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
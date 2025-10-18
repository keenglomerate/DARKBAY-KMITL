import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx'; // <-- IMPORT
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        {/* WRAP THE APP WITH THE NEW PROVIDER */}
        <SocketContextProvider> 
          <App />
        </SocketContextProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
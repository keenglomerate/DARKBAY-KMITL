import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListingPage from './pages/CreateListingPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import MessagesPage from './pages/MessagesPage';
import CheckoutPage from './pages/CheckoutPage';
import ListingDetailPage from './pages/ListingDetailPage';
import BrowsePage from './pages/BrowsePage';

function App() {
  return (
    <div className="bg-dark-bg text-light-text font-mono flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/browse" element={<BrowsePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/new-listing" element={<CreateListingPage />} />
            <Route path="/dashboard" element={<SellerDashboardPage />} />
            {/* THIS IS THE CORRECTED ROUTE for messages */}
            <Route path="/messages/:conversationId?" element={<MessagesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;

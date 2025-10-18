import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const SellerDashboardPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSellerListings = async () => {
      if (!user) return;
      try {
        const { data } = await api.get(`/listings/seller/${user._id}`);
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch seller listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerListings();
  }, [user]);

  if (loading) return <p className="text-center text-brand-green">Loading dashboard...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-green tracking-wider">SELLER DASHBOARD</h1>
          <p className="text-medium-text">Welcome back, purveyor of questionable academic artifacts</p>
        </div>
        <Link to="/new-listing" className="bg-brand-green text-dark-bg font-bold py-2 px-5 rounded-md hover:bg-brand-green-dark transition-colors">
          + New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
          <h3 className="text-medium-text mb-2">Active Listings</h3>
          <p className="text-4xl font-bold">{listings.length}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
          <h3 className="text-medium-text mb-2">Total Views</h3>
           <p className="text-4xl font-bold">{listings.reduce((acc, item) => acc + item.views, 0)}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
          <h3 className="text-medium-text mb-2">Unread Messages</h3>
          <p className="text-4xl font-bold">0</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg">
        <h2 className="text-xl font-bold p-6">My Listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border text-medium-text text-sm uppercase">
                <th className="p-4 font-normal">Item</th>
                <th className="p-4 font-normal">Price</th>
                <th className="p-4 font-normal">Views</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Created</th>
              </tr>
            </thead>
            <tbody>
              {listings.length > 0 ? listings.map(listing => (
                <tr key={listing._id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-bg">
                  <td className="p-4 font-bold text-light-text">{listing.title}</td>
                  <td className="p-4 text-brand-green font-bold">${listing.price}</td>
                  <td className="p-4 text-light-text">{listing.views}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300 capitalize">
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-4 text-medium-text">{new Date(listing.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center text-medium-text p-8">You have not listed any artifacts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
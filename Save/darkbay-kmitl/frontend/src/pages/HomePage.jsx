import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await api.get('/listings');
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const categories = [
    { name: 'Textbooks', icon: '📖' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Food & Drink', icon: '🍺' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Random Junk', icon: '💀' },
  ];

  return (
    <div>
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-brand-green mb-4 tracking-wider animate-pulse">DARKBAY-KMITL</h1>
        <p className="text-medium-text mb-8">Marketplace for students. Totally not sketchy.</p>
        <div>
          <Link to="/new-listing" className="bg-brand-green text-dark-bg font-bold py-3 px-8 rounded-md hover:bg-brand-green-dark transition-colors mr-4">
            Start Selling
          </Link>
          <Link to="/browse" className="bg-dark-card border border-dark-border font-bold py-3 px-8 rounded-md hover:border-brand-green transition-colors">
            Browse Market
          </Link>
        </div>
      </div>

      <div className="my-12">
        <h2 className="text-center text-2xl text-medium-text tracking-widest mb-8 uppercase">Categories</h2>
        <div className="flex justify-center space-x-6">
          {categories.map(cat => (
            // THIS IS THE CORRECTED PART - EACH CATEGORY IS NOW A LINK
            <Link 
              to={`/browse?category=${cat.name}`} 
              key={cat.name} 
              className="flex flex-col items-center p-6 border border-dark-border rounded-lg bg-dark-card w-40 hover:border-brand-green cursor-pointer transition-all hover:-translate-y-1"
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-light-text">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

       <div className="my-12">
        <h2 className="text-center text-2xl text-medium-text tracking-widest mb-8 uppercase">Trending This Week</h2>
        {loading ? (
            <p className="text-center text-brand-green">Loading artifacts...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.slice(0, 4).map(listing => (
                    <ListingCard key={listing._id} listing={listing} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

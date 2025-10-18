import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const ListingDetailPage = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Contacting seller... (Feature coming soon!)');
  };

  if (loading) return <p className="text-center text-brand-green">Loading item details from the matrix...</p>;
  if (!listing) return <p className="text-center text-red-500">This artifact seems to have vanished from our reality.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md-col-span-2">
        <img src={`http://localhost:5000${listing.images[0]}`} alt={listing.title} className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-dark-border bg-dark-card" />
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex flex-col h-fit">
        <h1 className="text-3xl font-bold text-light-text mb-2">{listing.title}</h1>
        <p className="text-medium-text mb-6">Sold by: <span className="text-brand-green">{listing.seller.username}</span></p>
        
        <p className="text-light-text mb-6 flex-grow min-h-[6rem]">{listing.description || "No description provided."}</p>

        <div className="border-t border-b border-dark-border py-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-medium-text">Condition:</span> <span className="font-bold">{listing.condition}</span></div>
          <div className="flex justify-between"><span className="text-medium-text">Category:</span> <span className="font-bold">{listing.category}</span></div>
          <div className="flex justify-between"><span className="text-medium-text">Views:</span> <span className="font-bold">{listing.views}</span></div>
        </div>

        <div className="text-4xl font-bold text-brand-green mb-6 text-right">${listing.price}</div>

        <button 
          onClick={handleContactSeller}
          className="w-full bg-brand-green text-dark-bg font-bold py-3 rounded-md hover:bg-brand-green-dark transition-colors"
        >
          Contact Seller
        </button>
      </div>
    </div>
  );
};

export default ListingDetailPage;
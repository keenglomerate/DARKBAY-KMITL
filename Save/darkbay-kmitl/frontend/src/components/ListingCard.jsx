import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const imageUrl = listing.images && listing.images.length > 0 
    ? `http://localhost:5000${listing.images[0]}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/listing/${listing._id}`} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden group block hover:border-brand-green transition-colors">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-light-text truncate">{listing.title}</h3>
        <p className="text-medium-text text-sm mb-3">Seller: {listing.seller?.username || 'Unknown'}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-brand-green">${listing.price}</span>
          <div className="text-brand-green text-sm group-hover:underline">View Item</div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
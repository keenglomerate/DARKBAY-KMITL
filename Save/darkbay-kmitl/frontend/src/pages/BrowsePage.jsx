import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import ListingCard from '../components/ListingCard';

const BrowsePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // State for our new filters
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedConditions, setSelectedConditions] = useState([]);
  
  const category = searchParams.get('category');

  // This effect will re-run whenever a filter changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Use URLSearchParams to easily build the query string
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);
        if (maxPrice < 1000) params.append('maxPrice', maxPrice);
        if (selectedConditions.length > 0) {
          params.append('conditions', selectedConditions.join(','));
        }

        const { data } = await api.get(`/listings?${params.toString()}`);
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [category, sort, maxPrice, selectedConditions]);

  // Handler for condition checkboxes
  const handleConditionChange = (condition) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <aside className="w-1/4 h-fit bg-dark-card border border-dark-border rounded-lg p-6 sticky top-24">
        <h2 className="text-xl font-bold text-brand-green mb-6 border-b border-dark-border pb-3">FILTERS</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Max Price: <span className="text-brand-green">${maxPrice}</span></label>
            <input type="range" min="0" max="1000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-brand-green" />
          </div>
          <div>
            <label className="text-sm font-bold text-medium-text block mb-2">Condition</label>
            <div className="space-y-2 text-sm">
              {['New-ish', 'Lightly Abused', 'Seen Many Exams', 'Questionable'].map(cond => (
                <label key={cond} className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedConditions.includes(cond)} onChange={() => handleConditionChange(cond)} className="mr-3 h-4 w-4 text-brand-green bg-dark-bg border-dark-border rounded focus:ring-brand-green" />
                  {cond}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Search Results */}
      <main className="w-3/4">
        <h1 className="text-3xl font-bold text-brand-green mb-6 uppercase">
          {category ? `${category}` : "Search Results"}
        </h1>
        {loading ? (
          <p className="text-medium-text">Querying the shadow realm...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length > 0 ? (
              listings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))
            ) : (
              <p className="text-medium-text col-span-3">No artifacts found in this dimension.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsePage;
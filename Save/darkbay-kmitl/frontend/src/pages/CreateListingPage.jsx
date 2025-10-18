import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateListingPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('New-ish');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setError('Please select a category.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('condition', condition);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Listing posted to the shadow market! May the algorithms be in your favor.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. The abyss rejected your offering.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-green mb-2 tracking-wider">CREATE NEW LISTING</h1>
      <p className="text-medium-text mb-8">Sell your questionable academic artifacts to follow sufferers</p>
      
      {error && <div className="bg-red-900 border border-red-500 text-red-200 p-3 rounded-md mb-6 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Left Column: Images - THIS LINE IS NOW CORRECT */}
        <div className="md:col-span-2 bg-dark-card border border-dark-border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Product Images</h2>
          <label htmlFor="image-upload" className="cursor-pointer block border-2 border-dashed border-dark-border rounded-lg p-8 text-center hover:border-brand-green transition-colors">
            <p className="text-brand-green">Drop images here or click to upload</p>
            <p className="text-medium-text mt-2 text-xs">Support for cursed JPEGs and haunted PNGs</p>
            <input id="image-upload" type="file" multiple onChange={handleImageChange} className="hidden" />
          </label>
          {images.length > 0 && (
            <div className="mt-4 text-sm text-medium-text">
              {images.length} file(s) selected.
            </div>
          )}
        </div>

        {/* Right Column: Details - THIS LINE IS NOW CORRECT */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-medium-text block mb-1">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green" />
              </div>
              <div>
                <label className="text-sm font-bold text-medium-text block mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green">
                  <option value="">Select category</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Random Junk">Random Junk</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-medium-text block mb-1">Price ($) *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green" />
              </div>
               <div>
                <label className="text-sm font-bold text-medium-text block mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="It comes with the tears of previous students built right in..." className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green"></textarea>
              </div>
               <div>
                <label className="text-sm font-bold text-medium-text block mb-1">Tags (comma-separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. math, cursed, textbook" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Condition</h2>
            <div className="space-y-3">
              {[
                { value: 'New-ish', label: 'Barely used, like your gym membership' },
                { value: 'Lightly Abused', label: 'Shows signs of academic stress' },
                { value: 'Seen Many Exams', label: 'Battle-tested and traumatized' },
                { value: 'Questionable', label: 'Proceed with caution' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input type="radio" name="condition" value={value} checked={condition === value} onChange={(e) => setCondition(e.target.value)} className="mr-3 h-4 w-4 text-brand-green bg-dark-bg border-dark-border focus:ring-brand-green" />
                  <div>
                    <span className="font-bold">{value}</span>
                    <span className="text-medium-text text-sm block">{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-brand-green text-dark-bg font-bold py-3 rounded-md hover:bg-brand-green-dark transition-colors shadow-green-glow">Post Listing to the Abyss</button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
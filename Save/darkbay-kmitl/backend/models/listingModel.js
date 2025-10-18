const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['active', 'sold', 'pending'],
    default: 'active',
  },
  views: {
      type: Number,
      default: 0
  }
}, {
  timestamps: true,
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
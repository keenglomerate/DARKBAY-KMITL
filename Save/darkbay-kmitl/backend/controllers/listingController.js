const Listing = require('../models/listingModel.js');

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  const { title, description, category, price, condition, tags } = req.body;
  
  const images = req.files ? req.files.map(file => `/${file.path}`) : [];

  const listing = new Listing({
    title,
    description,
    category,
    price,
    condition,
    tags: JSON.parse(tags), // Assuming tags are sent as a JSON string array
    images,
    seller: req.user._id,
  });

  const createdListing = await listing.save();
  res.status(201).json(createdListing);
};

// @desc    Get all listings with filtering and sorting
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  const { keyword, category, maxPrice, conditions, sort } = req.query;
  const filter = {};

  // Build the filter object based on query params
  if (keyword) {
    filter.title = { $regex: keyword, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (maxPrice) {
    filter.price = { $lte: Number(maxPrice) }; // $lte means less than or equal to
  }
  if (conditions) {
    filter.condition = { $in: conditions.split(',') }; // $in matches any value in an array
  }
  
  // Determine sorting options
  const sortOptions = {};
  if (sort === 'price-asc') {
    sortOptions.price = 1; // 1 for ascending
  } else if (sort === 'price-desc') {
    sortOptions.price = -1; // -1 for descending
  } else {
    sortOptions.createdAt = -1; // Default to newest
  }
    
  // Execute the query with filters and sorting
  const listings = await Listing.find(filter)
    .sort(sortOptions)
    .populate('seller', 'username');
    
  res.json(listings);
};


// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('seller', 'username email');
  if (listing) {
    listing.views += 1; // Increment view count
    await listing.save();
    res.json(listing);
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
};

// @desc    Get listings for a specific seller
// @route   GET /api/listings/seller/:userId
// @access  Public
const getListingsBySeller = async (req, res) => {
  const listings = await Listing.find({ seller: req.params.userId });
  if (listings) {
    res.json(listings);
  } else {
    res.status(404).json({ message: 'No listings found for this seller' });
  }
};

module.exports = { createListing, getListings, getListingById, getListingsBySeller };
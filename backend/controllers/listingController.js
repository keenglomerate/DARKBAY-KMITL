import Listing from '../models/listingModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  const { title, description, category, price, condition, tags } = req.body;
  const images = req.files ? req.files.map(file => `/${file.path.replace(/\\/g, "/")}`) : [];

  const listing = new Listing({
    title,
    description,
    category,
    price,
    condition,
    tags: JSON.parse(tags),
    images,
    seller: req.user._id,
  });

  const createdListing = await listing.save();
  res.status(201).json(createdListing);
});

// @desc    Get all listings with filtering and sorting
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
    const { keyword, category, maxPrice, conditions, sort } = req.query;
    const filter = {};
  
    if (keyword) filter.title = { $regex: keyword, $options: 'i' };
    if (category) filter.category = category;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (conditions) filter.condition = { $in: conditions.split(',') };
    
    const sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else sortOptions.createdAt = -1;
      
    const listings = await Listing.find(filter).sort(sortOptions).populate('seller', 'username');
    res.json(listings);
});

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('seller', 'username email');
  if (listing) {
    listing.views += 1;
    await listing.save();
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

// @desc    Get listings for a specific seller
// @route   GET /api/listings/seller/:userId
// @access  Public
const getListingsBySeller = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ seller: req.params.userId });
  if (listings) {
    res.json(listings);
  } else {
    res.status(404);
    throw new Error('No listings found for this seller');
  }
});

export { createListing, getListings, getListingById, getListingsBySeller };
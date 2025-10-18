const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createListing, getListings, getListingById, getListingsBySeller } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.route('/')
  .post(protect, upload.array('images', 5), createListing)
  .get(getListings);

router.route('/seller/:userId').get(getListingsBySeller);
router.route('/:id').get(getListingById);


module.exports = router;
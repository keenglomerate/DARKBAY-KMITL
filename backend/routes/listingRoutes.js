import express from 'express';
import multer from 'multer';
import path from 'path';
import { createListing, getListings, getListingById, getListingsBySeller } from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

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

export default router;
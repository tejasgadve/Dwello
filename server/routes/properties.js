const express = require('express');
const { body } = require('express-validator');
const {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, getMyListings, getFeaturedProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const propertyValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('type').isIn(['PG', 'Flat', 'Hostel', 'Room']).withMessage('Invalid property type'),
  body('price').isNumeric().isFloat({ min: 500 }).withMessage('Valid price is required'),
  body('genderPreference').isIn(['Boys', 'Girls', 'Co-ed']).withMessage('Invalid gender preference'),
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode').notEmpty().withMessage('Pincode is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
];

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyListings);
router.get('/:id', getProperty);
router.post('/', protect, authorize('owner', 'admin'), propertyValidation, createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;

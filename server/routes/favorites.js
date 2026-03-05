const express = require('express');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getFavorites);
router.post('/:propertyId', protect, toggleFavorite);

module.exports = router;

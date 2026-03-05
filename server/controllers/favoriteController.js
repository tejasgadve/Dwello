/**
 * Favorite Controller - Save/unsave properties
 */

const User = require('../models/User');
const Property = require('../models/Property');

// ─── @route  POST /api/favorites/:propertyId ──────────────────────────────────
const toggleFavorite = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const user = await User.findById(req.user._id);
    const isSaved = user.savedProperties.includes(req.params.propertyId);

    if (isSaved) {
      user.savedProperties.pull(req.params.propertyId);
      await user.save();
      return res.json({ success: true, message: 'Removed from favorites', isSaved: false });
    } else {
      user.savedProperties.push(req.params.propertyId);
      await user.save();
      return res.json({ success: true, message: 'Added to favorites', isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/favorites ───────────────────────────────────────────────
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedProperties',
      populate: { path: 'owner', select: 'name phone' },
    });

    res.json({ success: true, data: user.savedProperties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleFavorite, getFavorites };

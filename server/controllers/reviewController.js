/**
 * Review Controller
 */

const Review = require('../models/Review');
const Property = require('../models/Property');

// ─── @route  POST /api/reviews/:propertyId ────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ property: req.params.propertyId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this property' });
    }

    const review = await Review.create({
      property: req.params.propertyId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({ success: true, message: 'Review added', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/reviews/:propertyId ─────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews, count: reviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/reviews/:id ─────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();
    await Review.calcAverageRating(review.property);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addReview, getReviews, deleteReview };

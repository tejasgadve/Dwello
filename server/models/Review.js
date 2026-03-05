/**
 * Review Model
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// One review per user per property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating
reviewSchema.statics.calcAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    { $group: { _id: '$property', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const Property = require('./Property');
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      'ratings.average': Math.round(stats[0].avg * 10) / 10,
      'ratings.count': stats[0].count,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      'ratings.average': 0,
      'ratings.count': 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.property);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.property);
});

module.exports = mongoose.model('Review', reviewSchema);

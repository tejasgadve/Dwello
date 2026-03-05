/**
 * Property Model
 * PGs and Flats listed by owners
 */

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['PG', 'Flat', 'Hostel', 'Room'],
      required: [true, 'Property type is required'],
    },
    price: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [500, 'Price must be at least ₹500'],
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    // ─── Location ─────────────────────────────────────────────────────────────
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    nearbyColleges: [
      {
        name: { type: String, required: true },
        distance: { type: Number }, // in km
      },
    ],
    // ─── Details ──────────────────────────────────────────────────────────────
    genderPreference: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-ed'],
      required: [true, 'Gender preference is required'],
    },
    occupancy: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Any'],
      default: 'Any',
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-furnished', 'Unfurnished'],
      default: 'Unfurnished',
    },
    // ─── Amenities ────────────────────────────────────────────────────────────
    amenities: {
      wifi: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
      hotWater: { type: Boolean, default: false },
      housekeeping: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
    },
    // ─── Images ───────────────────────────────────────────────────────────────
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public ID for deletion
      },
    ],
    // ─── Owner & Status ───────────────────────────────────────────────────────
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true, // Set false to require admin approval
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // ─── Ratings ──────────────────────────────────────────────────────────────
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
propertySchema.index({ location: '2dsphere' }); // Geospatial index
propertySchema.index({ price: 1 });
propertySchema.index({ 'nearbyColleges.name': 'text', title: 'text', description: 'text' });
propertySchema.index({ genderPreference: 1, type: 1, isAvailable: 1 });

// ─── Virtual: reviews ─────────────────────────────────────────────────────────
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
});

module.exports = mongoose.model('Property', propertySchema);

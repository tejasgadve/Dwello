/**
 * Property Controller
 * CRUD operations for properties with advanced filtering
 */

const Property = require('../models/Property');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// ─── @route  GET /api/properties ──────────────────────────────────────────────
const getProperties = async (req, res) => {
  try {
    const {
      college,
      city,
      minPrice,
      maxPrice,
      gender,
      type,
      amenities,
      sort,
      page = 1,
      limit = 12,
      search,
      lat,
      lng,
      radius = 5, // km
    } = req.query;

    const query = { isAvailable: true, isApproved: true };

    // ─── Text search ──────────────────────────────────────────────────────────
    if (search) {
      query.$text = { $search: search };
    }

    // ─── College filter ───────────────────────────────────────────────────────
    if (college) {
      query['nearbyColleges.name'] = { $regex: college, $options: 'i' };
    }

    // ─── City filter ──────────────────────────────────────────────────────────
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // ─── Price range ──────────────────────────────────────────────────────────
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ─── Gender preference ────────────────────────────────────────────────────
    if (gender && gender !== 'All') {
      query.$or = [{ genderPreference: gender }, { genderPreference: 'Co-ed' }];
    }

    // ─── Property type ────────────────────────────────────────────────────────
    if (type) query.type = type;

    // ─── Amenities filter ─────────────────────────────────────────────────────
    if (amenities) {
      const amenityList = amenities.split(',');
      amenityList.forEach((amenity) => {
        query[`amenities.${amenity.trim()}`] = true;
      });
    }

    // ─── Geospatial filter ────────────────────────────────────────────────────
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    // ─── Sort options ─────────────────────────────────────────────────────────
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular') sortOption = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name phone email avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Property.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/properties/:id ──────────────────────────────────────────
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name phone email avatar createdAt')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 },
      });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/properties ─────────────────────────────────────────────
const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const propertyData = { ...req.body, owner: req.user._id };
    const property = await Property.create(propertyData);
    await property.populate('owner', 'name phone email');

    res.status(201).json({ success: true, message: 'Property listed successfully', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PUT /api/properties/:id ──────────────────────────────────────────
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only owner or admin can update
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name phone email');

    res.json({ success: true, message: 'Property updated', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/properties/:id ───────────────────────────────────────
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    // Also remove from users' saved properties
    await User.updateMany(
      { savedProperties: req.params.id },
      { $pull: { savedProperties: req.params.id } }
    );

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/properties/owner/my-listings ────────────────────────────
const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/properties/featured ─────────────────────────────────────
const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, isAvailable: true, isApproved: true })
      .populate('owner', 'name')
      .limit(6)
      .lean();

    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
  getFeaturedProperties,
};

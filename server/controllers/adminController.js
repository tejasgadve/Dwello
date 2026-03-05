/**
 * Admin Controller - User & listing management
 */

const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');

// ─── @route  GET /api/admin/dashboard ─────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProperties, totalStudents, totalOwners, pendingListings] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner' }),
      Property.countDocuments({ isApproved: false }),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentListings = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name')
      .select('title price type address isApproved createdAt');

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalProperties, totalStudents, totalOwners, pendingListings },
        recentUsers,
        recentListings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/admin/users ─────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PATCH /api/admin/users/:id/toggle ────────────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/admin/properties ────────────────────────────────────────
const getAdminProperties = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.json({ success: true, data: properties, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PATCH /api/admin/properties/:id/approve ──────────────────────────
const togglePropertyApproval = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    property.isApproved = !property.isApproved;
    await property.save();

    res.json({ success: true, message: `Property ${property.isApproved ? 'approved' : 'unapproved'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/admin/properties/:id ─────────────────────────────────
const adminDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    res.json({ success: true, message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getUsers, toggleUserStatus, getAdminProperties, togglePropertyApproval, adminDeleteProperty };

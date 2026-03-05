const express = require('express');
const {
  getDashboard, getUsers, toggleUserStatus,
  getAdminProperties, togglePropertyApproval, adminDeleteProperty
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.get('/properties', getAdminProperties);
router.patch('/properties/:id/approve', togglePropertyApproval);
router.delete('/properties/:id', adminDeleteProperty);

module.exports = router;

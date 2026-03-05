/**
 * Upload Route - Cloudinary image upload
 */

const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Use memory storage; encode to base64 for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    // If cloudinary is configured, upload there
    // Otherwise return placeholder URLs for development
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name') {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          cloudinary.uploader.upload(base64, { folder: 'Dwello' }, (err, result) => {
            if (err) reject(err);
            else resolve({ url: result.secure_url, publicId: result.public_id });
          });
        });
      });

      const images = await Promise.all(uploadPromises);
      return res.json({ success: true, images });
    }

    // Development fallback: return placeholder images
    const images = req.files.map((file, i) => ({
      url: `https://picsum.photos/seed/${Date.now() + i}/800/600`,
      publicId: `placeholder_${Date.now() + i}`,
    }));

    res.json({ success: true, images, note: 'Cloudinary not configured - using placeholder images' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

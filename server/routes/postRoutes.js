const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createPost, getFeed, getPost, getAdminPosts, getAllPosts } = require('../controllers/postController');
const { auth, requireRole } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file extension
    const fileExt = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    // Check mimetype
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    const isValidExtension = allowedExtensions.includes(fileExt);
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype.toLowerCase());
    
    // Accept if either extension or mimetype is valid (more lenient)
    if (isValidExtension || isValidMimeType) {
      return cb(null, true);
    } else {
      return cb(new Error(`Invalid file type. Only image files (${allowedExtensions.join(', ')}) are allowed.`));
    }
  }
});

// Wrap upload middleware to handle errors
const uploadMiddleware = (req, res, next) => {
  upload.array('images', 3)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'Too many files. Maximum 3 images allowed.' });
        }
        return res.status(400).json({ message: err.message || 'File upload error' });
      }
      // Handle fileFilter errors
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
};

// Routes
router.post('/create', 
  auth, 
  requireRole('admin', 'masterAdmin'), 
  uploadMiddleware,
  createPost
);
router.get('/feed', getFeed);
router.get('/:id', getPost);
router.get('/admin/my-posts', auth, requireRole('admin', 'masterAdmin'), getAdminPosts);
router.get('/admin/all-posts', auth, requireRole('masterAdmin'), getAllPosts);

module.exports = router;



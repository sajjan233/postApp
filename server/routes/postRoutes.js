const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require("sharp");
const { createPost, getFeed,getAllFeed, getPost,postUrl, getAdminPosts, getAllPosts, getPostsByCategory,createImgPost, updatePost } = require('../controllers/postController.js');
const { auth, requireRole } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ---------------------------
// 1. Multer memory storage
// ---------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max RAW upload (compression ke baad size 200-400 KB ho jata hai)
    files: 3
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, true);
  }
});

// -------------------------------------------
// 2. Custom middleware to compress all images
// -------------------------------------------
const compressImagesMiddleware = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const compressedFiles = [];
    for (let file of req.files) {      
      const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const outputPath = path.join(uploadsDir, filename);

      await sharp(file.buffer)
        .resize({ width: 1080 })     // max width 1080px
        .webp({ quality: 70 })       // convert everything to webp
        .toFile(outputPath);

      compressedFiles.push({
        filename,
        path: outputPath
      });
    }

    req.files = compressedFiles;
    next();

  } catch (error) {
    console.error("Compression Error:", error);
    return res.status(500).json({ message: "File compression failed" });
  }
};


// ----------------------------
// Routes
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
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
};
router.post(
  "/create",
  auth,
  uploadMiddleware,
  compressImagesMiddleware,
  createPost
);

router.put(
  "/:id",
  auth,
  uploadMiddleware,
  compressImagesMiddleware,
  updatePost
);


// No change for GET routes, populate category in controller handles it
router.get('/feed',auth, getFeed);
router.get('/allfeed', getAllFeed);

router.get('/:id',auth, getPost);
router.get('/:postId', postUrl);
router.get('/admin/my-posts', auth, requireRole('admin', 'masterAdmin'), getAdminPosts);
router.get('/admin/all-posts', auth, requireRole('masterAdmin'), getAllPosts);
router.get('/category/:categoryId', getPostsByCategory);
router.post('/createimgpost',auth, createImgPost);

module.exports = router;


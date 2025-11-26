const Post = require('../models/Post.js');
const User = require('../models/User.js');
const CustomerAdminMap = require('../models/CustomerAdminMap.js');
const Counter = require('../models/Counter.js');
const Category = require('../models/Category.js'); // add category

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body; // include categoryId
    const adminId = req.user._id;

    if (!categoryId) {
      return res.status(400).json({ message: 'categoryId is required' });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Handle file uploads (images)
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    if (images.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed' });
    }

    // Generate postId
    const counter = await Counter.findByIdAndUpdate(
      { _id: "postid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const postId = `user${counter.seq}`;

    const post = new Post({
      adminId,
      categoryId, // save category
      title,
      description,
      images,
      postId
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Feed for Customer
exports.getFeed = async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    const mappings = await CustomerAdminMap.find({ customerId });
    const adminIds = mappings.map(m => m.adminId);

    const masterAdmin = await User.findOne({ role: 'masterAdmin' });
    const masterAdminId = masterAdmin ? masterAdmin._id : null;

    const allAdminIds = [...adminIds];
    if (masterAdminId) allAdminIds.push(masterAdminId);

    const posts = await Post.find({ adminId: { $in: allAdminIds } })
      .populate('adminId', 'name shopName')
      .populate('categoryId', 'name slug') // populate category
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('adminId', 'name shopName')
      .populate('categoryId', 'name slug'); // populate category

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Admin's Own Posts
exports.getAdminPosts = async (req, res) => {
  try {
    const adminId = req.user._id;

    const posts = await Post.find({ adminId })
      .populate('categoryId', 'name slug') // populate category
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get admin posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Posts (Master Admin)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('adminId', 'name shopName role')
      .populate('categoryId', 'name slug') // populate category
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controllers/postController.js
exports.getPostsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: 'categoryId is required' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Fetch posts of this category
    const posts = await Post.find({ categoryId })
      .populate('adminId', 'name shopName')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ category: category.name, posts });
  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

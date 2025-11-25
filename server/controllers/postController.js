const Post = require('../models/Post');
const User = require('../models/User');
const CustomerAdminMap = require('../models/CustomerAdminMap');
const Counter = require('../models/Counter');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const adminId = req.user._id;

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

         const counter = await Counter.findByIdAndUpdate(
      { _id: "postid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

        const postId = `user${counter.seq}`;

    const post = new Post({
      adminId,
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
    console.log("customerId",customerId);
    

    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    // Get all admin IDs linked to this customer
    const mappings = await CustomerAdminMap.find({ customerId });
    const adminIds = mappings.map(m => m.adminId);

    // Get masterAdmin ID
    const masterAdmin = await User.findOne({ role: 'masterAdmin' });
    console.log("masterAdmin",masterAdmin);
    
    const masterAdminId = masterAdmin ? masterAdmin._id : null;

    // Combine admin IDs (selected admins + masterAdmin)
    const allAdminIds = [...adminIds];
    if (masterAdminId) {
      allAdminIds.push(masterAdminId);
    }

    console.log("allAdminIds",allAdminIds);
    
    // Get posts from all these admins, sorted by createdAt descending
    const posts = await Post.find({
      adminId: { $in: allAdminIds }
    })
    .populate('adminId', 'name shopName')
    .sort({ createdAt: -1 });
console.log("posts",posts);

    res.json({
      posts

    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id",id)

    const post = await Post.findById(id).populate('adminId', 'name shopName');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      post
    });
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
      .sort({ createdAt: -1 });

    res.json({
      posts
    });
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
      .sort({ createdAt: -1 });

    res.json({
      posts
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
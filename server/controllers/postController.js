const Post = require('../models/Post.js');
const User = require('../models/User.js');
const CustomerAdminMap = require('../models/CustomerAdminMap.js');
const Counter = require('../models/Counter.js');
const Category = require('../models/Category.js'); // add category
const { generateMobileImage } = require('../scripts/comman.js')
// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body; // include categoryId
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

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId } = req.body;

    // existingImages को parse करें (array या single string)
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === "string") {
      existingImages = [existingImages];
    } else if (typeof existingImages === "object" && !Array.isArray(existingImages)) {
      existingImages = Object.values(existingImages); // multer formData से आ सकता है
    }

    const adminId = req.user._id;

    // Find post
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check ownership
    if (post.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update text fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (categoryId) post.categoryId = categoryId;

    // Handle new uploaded images


    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Combine existing + new images
    const finalImages = [...existingImages, ...newImages];

    // Max 3 images
    if (finalImages.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    post.images = finalImages;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });

  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Feed for Customer
exports.getFeed = async (req, res) => {
  try {

    const allAdminIds = [...req.user.connections, '6921c18a71c8817b35046318'];

    let filter = {}
    if (allAdminIds.length) {
      filter = { adminId: { $in: allAdminIds } }
    }

    const posts = await Post.find(filter)
      .populate('adminId', 'name shopName')
      .populate('categoryId', 'name slug') // populate category
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllFeed = async (req, res) => {
  try {
console.log("fffffffffff");

    const allAdminIds = [ '6921c18a71c8817b35046318'];

    let filter = {}
    if (allAdminIds.length) {
      filter = { adminId: { $in: allAdminIds } }
    }

    const posts = await Post.find(filter)
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


    const alreadyViewed = post.viewedBy.some(
      (id) => id.equals(req.user._id)
    );

    if (!alreadyViewed) {
      post.viewsCount += 1;
      post.viewedBy.push(req.user._id);
      await post.save();
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
      return res.status(400).json({ message: 'provid is required' });
    }

    // Check if category exists
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);




    const posts = await Post.find({ adminId: categoryId, createdAt: { $gte: last24Hours } })
      .populate('adminId', 'name shopName')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });


    res.json({ posts });
  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createImgPost = async (req, res) => {
  let response = {
    message: "",
    status: 0
  }
  try {
    let resp = await generateMobileImage(req.body)

    response.resp = resp
    return res.json(response)


  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: error.message });

  }
} 


exports.postUrl = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("adminId");

    const title = post?.title || "Post24 Post";
    const description = post?.description || "Check this post on Post24";
    const image = post?.images?.[0]
      ? `https://post24.in/${post.images[0]}`
      : "https://post24.in/default_post_image.png";

    const url = `https://post24.in/posts/${postId}`; // page URL
    const appLink = `post24://post?postId=${postId}`;
    const playStoreLink = `https://play.google.com/store/apps/details?id=com.sajjan_node_dev.post24`;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>

        <!-- OG tags for FB/Twitter/WA preview -->
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${url}" />
        <meta name="twitter:card" content="summary_large_image" />

        <!-- Fallback to Play Store / App -->
        <script>
          setTimeout(() => { window.location = "${playStoreLink}"; }, 1500);
          window.location = "${appLink}";
        </script>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
        <img src="${image}" alt="Post Image" style="max-width:100%;" />
        <p>If app doesn't open automatically, <a href="${playStoreLink}">click here</a>.</p>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};


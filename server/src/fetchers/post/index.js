import Post from "./post.js";
import User from "../user/user.js"; // user मॉडल इम्पोर्ट करें
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// ObjectId type
const ObjectId = mongoose.Types.ObjectId;
// 🔹 Create Post (by any logged-in user)
export const createPost = async (req, res) => {
  try {
    console.log("req.file", req.file);

    const { title, description } = req.body;
    const userId = req.user.id; // JWT से मिला हुआ यूज़र ID
    const image = req.file ? `/uploads/${req.file.filename}` : null; // image path save
    const post = await Post.create({
      title,
      description,
      image: image,
      createdBy: userId,
    });

    // Populate the post with creator info for real-time update
    const populatedPost = await Post.findById(post._id)
      .populate('createdBy', 'name email shopName')
      .lean();

    // Add likes and saves count
    const postData = {
      ...populatedPost,
      likesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
    };

    // Emit newPost event to all connected clients
    if (global.io) {
      global.io.emit('newPost', postData);
      console.log('📢 Emitted newPost event:', post._id);
    }

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔹 Get Posts (role-based access)
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.slug; // JWT से मिला हुआ role slug

    let posts = [];

    if (userRole === "subadmin") {
      // 🧩 Admin → सबके पोस्ट देखेगा
      posts = await Post.find().populate("createdBy", "name email roleId");
    } else if (userRole === "subadmin") {
      // 🧩 SubAdmin → खुद के + अपने customers के पोस्ट
      const customers = await User.find({ parentId: userId }, "_id");
      const ids = customers.map((c) => c._id).concat(userId);

      posts = await Post.find({ createdBy: { $in: ids } })
        .populate("createdBy", "name email roleId");
    } else {
      // 🧩 Customer → सिर्फ अपने पोस्ट
      posts = await Post.find({ createdBy: userId })
        .populate("createdBy", "name email roleId");
    }

    return res.status(200).json({
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.error("Get Posts Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};


export const allPost = async (req, res) => {
  let response = {
    message: "",
    status: 0
  }
  try {
    let filter = {}

    if (req.body.centerid) {
      filter.createdBy = new ObjectId(req.body.centerid)
    }
    let posts = await Post.find(filter)
      .populate('createdBy', 'name email shopName')
      .sort({ _id: -1 });
    
    // Add likes and saves count to each post
    const userId = req.user?.id || req.user?._id;
    posts = posts.map(post => {
      const postObj = post.toObject();
      return {
        ...postObj,
        likesCount: post.likes?.length || 0,
        savesCount: post.saves?.length || 0,
        isLiked: userId ? post.likes?.some(id => id.toString() === userId.toString()) : false,
        isSaved: userId ? post.saves?.some(id => id.toString() === userId.toString()) : false,
      };
    });
    
    response.message = ''
    response.list = posts
    response.status = 1

    return res.json(response)
  } catch (err) {
    response.message = err.message
    response.status = 0
    return res.json(response)
  }
}

// 🔹 Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Find the post and verify ownership
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns this post
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to update this post" });
    }

    // Update fields
    const updateData = { title, description };
    
    // If new image is uploaded, update image path and optionally delete old image
    if (req.file) {
      // Delete old image if it exists
      if (post.image) {
        const oldImagePath = path.join(process.cwd(), 'public', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔹 Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the post and verify ownership
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns this post
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to delete this post" });
    }

    // Delete associated image file
    if (post.image) {
      const imagePath = path.join(process.cwd(), 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete post from database
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔹 Like/Unlike Post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = post.likes.includes(userId);
    const isInUserLikes = user.likedPosts.includes(postId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(id => id.toString() !== postId);
    } else {
      // Like
      post.likes.push(userId);
      if (!isInUserLikes) {
        user.likedPosts.push(postId);
      }
    }

    await post.save();
    await user.save();

    res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      liked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("Toggle Like Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔹 Save/Unsave Post
export const toggleSave = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = post.saves.includes(userId);
    const isInUserSaves = user.savedPosts.includes(postId);

    if (isSaved) {
      // Unsave
      post.saves = post.saves.filter(id => id.toString() !== userId);
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      // Save
      post.saves.push(userId);
      if (!isInUserSaves) {
        user.savedPosts.push(postId);
      }
    }

    await post.save();
    await user.save();

    res.status(200).json({
      message: isSaved ? "Post unsaved" : "Post saved",
      saved: !isSaved,
      savesCount: post.saves.length,
    });
  } catch (err) {
    console.error("Toggle Save Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
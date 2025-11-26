import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../api";
import PostCard from "../components/PostCard";
import FeedHeader from "../components/FeedHeader";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // selected category
  const navigate = useNavigate();

  // Load all posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts function
  const fetchPosts = async (categoryId = null) => {
    setLoading(true);
    setError(null);

    try {
      let res;
      if (categoryId) {
        res = await postAPI.getPostsByCategory(categoryId); // GET /posts/category/:categoryId
      } else {
        const customerId = localStorage.getItem("customerId");
        res = await postAPI.getFeed(customerId); // all feed
      }
      setPosts(res.data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Handle category click from FeedHeader
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId); // highlight selected category
    fetchPosts(categoryId);
  };

  const handlePostClick = (postId) => navigate(`/post/${postId}`);
  const openMenu = () => alert("Menu clicked! Open sidebar here.");

  if (loading) return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="feed">
      {/* Header */}
      <FeedHeader
        openMenu={openMenu}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Spacer so content doesn't hide behind fixed header */}
      <div style={{ height: "100px" }}></div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts available.</p>
        </div>
      ) : (
        <div className="feed-container">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onClick={() => handlePostClick(post._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;

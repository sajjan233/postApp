import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../api";
import PostCard from "../components/PostCard";
import FeedHeader from "../components/FeedHeader";
import StoryModal from "../components/StoryModal";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // selected category

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyPosts, setStoryPosts] = useState([]); // selected category posts for stories

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
        res = await postAPI.getByCategory(categoryId); // GET /posts/category/:categoryId
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

  // Handle category click
  const handleCategorySelect = async (categoryId) => {
    setActiveCategory(categoryId); // highlight selected category

    try {
      const res = await postAPI.getByCategory(categoryId);
      const categoryPosts = res.data.posts || [];

      setPosts(categoryPosts);       // feed update
      setStoryPosts(categoryPosts);  // story modal data
      setShowStoryModal(true);       // open story modal
    } catch (err) {
      console.error(err);
    }
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

      {/* Story Modal */}
      {showStoryModal && (
        <StoryModal
          stories={storyPosts}
          initialIndex={0}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {/* Feed Posts */}
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

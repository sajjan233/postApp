import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../api';
import PostCard from '../components/PostCard';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeed = async () => {
      const customerId = localStorage.getItem('customerId');

      // FIXED: activeAdmin parse
      const activeAdminRaw = localStorage.getItem('activeAdmin');
      const activeAdmin = activeAdminRaw ? JSON.parse(activeAdminRaw) : null;

      console.log("Active Admin →", activeAdmin);

      // If no customer & no admin → go back
      if (!customerId && !activeAdmin) {
        navigate('/');
        return;
      }

      try {
        if (customerId) {
          const response = await postAPI.getFeed(customerId);
          setPosts(response.data.posts);
        } else {
          setError('Please select an admin first');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [navigate]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner"></div>
        <p>Loading feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Choose Admin
        </button>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <h1>Your Feed</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Change Admin
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts available yet. Check back later!</p>
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

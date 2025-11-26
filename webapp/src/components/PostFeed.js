/**
 * PostFeed Component
 * Main feed component that displays all posts
 * Integrates with Socket.io for real-time updates
 * Includes AdSense ads between posts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { getAllPosts } from '../utils/api';
import PostCard from './PostCard';
import AdSense from './AdSense';
import { APP_CONFIG } from '../config/constants';
import './PostFeed.css';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { socket, isConnected, newPost, clearNewPost } = useSocket();

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllPosts();
      
      if (response.status === 1 && response.list) {
        setPosts(response.list);
        setHasMore(response.list.length > 0);
      } else {
        setError(response.message || 'Failed to load posts');
        setPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Listen for new posts from Socket.io
  useEffect(() => {
    if (socket && isConnected && newPost) {
      // Add new post to the beginning of the feed
      setPosts((prevPosts) => {
        // Check if post already exists to avoid duplicates
        const exists = prevPosts.some((p) => p._id === newPost._id);
        if (exists) return prevPosts;
        
        return [newPost, ...prevPosts];
      });
      
      // Clear the new post notification after adding
      clearNewPost();
    }
  }, [socket, isConnected, newPost, clearNewPost]);

  // Handle post update (from like/save actions)
  const handlePostUpdate = useCallback((updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? { ...post, ...updatedPost } : post
      )
    );
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="post-feed">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && posts.length === 0) {
    return (
      <div className="post-feed">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchPosts} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (posts.length === 0) {
    return (
      <div className="post-feed">
        <div className="empty-container">
          <p>No posts available yet.</p>
          <p className="empty-subtitle">Check back later for new content!</p>
        </div>
      </div>
    );
  }

  // Render posts with ads
  return (
    <div className="post-feed">
      {/* Socket connection indicator */}
      {isConnected && (
        <div className="connection-indicator connected">
          <span className="indicator-dot"></span>
          <span>Live updates enabled</span>
        </div>
      )}

      {/* New post notification */}
      {newPost && (
        <div className="new-post-notification">
          <span>✨ New post available! Scroll to see it.</span>
        </div>
      )}

      {/* Posts list */}
      <div className="posts-container">
        {posts.map((post, index) => (
          <React.Fragment key={post._id || index}>
            <PostCard post={post} onUpdate={handlePostUpdate} />
            
            {/* Show AdSense ad after every N posts (configurable) */}
            {(index + 1) % APP_CONFIG.AD_FREQUENCY === 0 && index < posts.length - 1 && (
              <div className="ad-container">
                <AdSense slot={`${(index + 1) / APP_CONFIG.AD_FREQUENCY}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <div className="end-of-feed">
          <p>You're all caught up! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;


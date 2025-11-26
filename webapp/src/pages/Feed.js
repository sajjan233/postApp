/**
 * Feed Page
 * Instagram Reels style vertical scroll feed
 * Shows posts from selected admin + masterAdmin posts
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostFeed } from '../utils/api';
import { getImageUrl } from '../utils/api';
import { useSocket } from '../context/SocketContext';
import './Feed.css';

const Feed = () => {
  const navigate = useNavigate();
  const { newPost, clearNewPost } = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track image index for each post
  const containerRef = useRef(null);

  // Get customer ID and active admin from localStorage
  const customerId = localStorage.getItem('customerId');
  const activeAdmin = JSON.parse(localStorage.getItem('activeAdmin') || '{}');

  useEffect(() => {
    // Check if customer has selected an admin
    if (!customerId || !activeAdmin.id) {
      navigate('/choose-admin');
      return;
    }

    fetchFeed();
  }, [customerId]);

  // Handle new post from Socket.io
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
      clearNewPost();
    }
  }, [newPost, clearNewPost]);

  const fetchFeed = async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getPostFeed(customerId);
      setPosts(response.posts || []);
      if (response.posts.length === 0) {
        setError('No posts available');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll to next/previous post
  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentIndex(newIndex);
      // Reset image index when switching posts
      setCurrentImageIndex((prev) => ({ ...prev, [posts[newIndex]?._id]: 0 }));
    }
  };

  // Handle image carousel navigation
  const handleImageChange = (postId, direction) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const images = post.images || (post.image ? [post.image] : []);
    const currentImgIndex = currentImageIndex[postId] || 0;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentImgIndex + 1) % images.length;
    } else {
      newIndex = (currentImgIndex - 1 + images.length) % images.length;
    }

    setCurrentImageIndex((prev) => ({ ...prev, [postId]: newIndex }));
  };

  // Handle post click
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

  if (error && posts.length === 0) {
    return (
      <div className="feed-error">
        <p>{error}</p>
        <button onClick={fetchFeed} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-empty">
        <p>No posts available</p>
        <button onClick={() => navigate('/choose-admin')} className="choose-admin-btn">
          Choose Another Admin
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container" ref={containerRef} onScroll={handleScroll}>
      {posts.map((post, index) => {
        const images = post.images || (post.image ? [post.image] : []);
        const currentImgIdx = currentImageIndex[post._id] || 0;
        const currentImage = images[currentImgIdx];

        return (
          <div
            key={post._id || index}
            className={`feed-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handlePostClick(post._id)}
          >
            {/* Post Image Carousel */}
            {currentImage && (
              <div className="post-image-container">
                <img
                  src={getImageUrl(currentImage)}
                  alt={post.title}
                  className="post-image"
                />
                
                {/* Image Navigation Dots */}
                {images.length > 1 && (
                  <div className="image-dots">
                    {images.map((_, imgIdx) => (
                      <span
                        key={imgIdx}
                        className={`dot ${imgIdx === currentImgIdx ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => ({ ...prev, [post._id]: imgIdx }));
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      className="image-nav-btn prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(post._id, 'prev');
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="image-nav-btn next"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(post._id, 'next');
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Post Content */}
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              {post.description && (
                <p className="post-description">{post.description}</p>
              )}
              <div className="post-meta">
                <span className="post-author">
                  {post.createdBy?.name || post.createdBy?.shopName || 'Unknown'}
                </span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="post-stats">
                <span>❤️ {post.likesCount || 0}</span>
                <span>🔖 {post.savesCount || 0}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;


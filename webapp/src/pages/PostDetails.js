/**
 * Post Details Page
 * Shows full post details with all images
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../utils/api';
import { getImageUrl } from '../utils/api';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPostById(id);
      setPost(response.post);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (direction) => {
    if (!post) return;
    const images = post.images || (post.image ? [post.image] : []);
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="post-details-loading">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-details-error">
        <p>{error || 'Post not found'}</p>
        <button onClick={() => navigate('/feed')} className="back-btn">
          Back to Feed
        </button>
      </div>
    );
  }

  const images = post.images || (post.image ? [post.image] : []);
  const currentImage = images[currentImageIndex];

  return (
    <div className="post-details-page">
      <button className="back-button" onClick={() => navigate('/feed')}>
        ← Back
      </button>

      <div className="post-details-container">
        {/* Image Section */}
        {currentImage && (
          <div className="post-image-section">
            <img
              src={getImageUrl(currentImage)}
              alt={post.title}
              className="post-detail-image"
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="detail-image-nav prev"
                  onClick={() => handleImageChange('prev')}
                >
                  ‹
                </button>
                <button
                  className="detail-image-nav next"
                  onClick={() => handleImageChange('next')}
                >
                  ›
                </button>
                
                {/* Image Dots */}
                <div className="detail-image-dots">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`detail-dot ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="post-details-content">
          <h1 className="post-detail-title">{post.title}</h1>
          
          {post.description && (
            <p className="post-detail-description">{post.description}</p>
          )}

          <div className="post-detail-meta">
            <div className="post-detail-author">
              <strong>Author:</strong> {post.createdBy?.name || post.createdBy?.shopName || 'Unknown'}
            </div>
            <div className="post-detail-date">
              <strong>Posted:</strong> {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="post-detail-stats">
            <span>❤️ {post.likesCount || 0} Likes</span>
            <span>🔖 {post.savesCount || 0} Saves</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../api';
import './PostDetails.css';
const API_BASE_URL = process.env.REACT_APP_API_URL ;

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await postAPI.getPost(id);
        setPost(response.data.post);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleImageChange = (direction) => {
    if (!post.images || post.images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="error">{error || 'Post not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/feed')}>
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="post-details">
      <div className="post-details-header">
        <button className="back-btn" onClick={() => navigate('/feed')}>← Back</button>
        <h1>Post Details</h1>
      </div>

      <div className="post-details-content">
        <div className="post-details-admin">
          <div className="admin-avatar-large">
            {post.adminId?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2>{post.adminId?.shopName || post.adminId?.name || 'Admin'}</h2>
            <p>{post.adminId?.name}</p>
          </div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="post-details-images">
            <div className="image-container-large">
              <img
                src={`${API_BASE_URL}${post.images[currentImageIndex]}`}
                alt={post.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Found';
                }}
              />
              {post.images.length > 1 && (
                <>
                  <button
                    className="image-nav-large prev"
                    onClick={() => handleImageChange('prev')}
                  >
                    ‹
                  </button>
                  <button
                    className="image-nav-large next"
                    onClick={() => handleImageChange('next')}
                  >
                    ›
                  </button>
                  <div className="image-indicators-large">
                    {post.images.map((_, index) => (
                      <span
                        key={index}
                        className={index === currentImageIndex ? 'active' : ''}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="post-details-text">
          <h1>{post.title}</h1>
          <p className="post-description">{post.description}</p>
          <p className="post-date">{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;



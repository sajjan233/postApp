import React, { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = post.images || [];

  const handleImageChange = (direction) => {
    if (images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-card" onClick={onClick}>
      <div className="post-header">
        <div className="post-admin-info">
          <div className="admin-avatar">{post.adminId?.name?.charAt(0) || 'A'}</div>
          <div>
            <h3>{post.adminId?.shopName || post.adminId?.name || 'Admin'}</h3>
            <p className="admin-name">{post.adminId?.name}</p>
          </div>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      {images.length > 0 && (
        <div className="post-images">
          <div className="image-container">
            <img
              src={`http://3.108.254.144:5000${images[currentImageIndex]}`}
              alt={post.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  className="image-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageChange('prev');
                  }}
                >
                  ‹
                </button>
                <button
                  className="image-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageChange('next');
                  }}
                >
                  ›
                </button>
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={index === currentImageIndex ? 'active' : ''}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="post-content">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
      </div>
    </div>
  );
};

export default PostCard;



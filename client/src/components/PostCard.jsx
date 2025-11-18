import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles.css';

const PostCard = ({ post, isAdmin = false, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [savesCount, setSavesCount] = useState(post.savesCount || post.saves?.length || 0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(post.isLiked || false);
    setSaved(post.isSaved || false);
    setLikesCount(post.likesCount || post.likes?.length || 0);
    setSavesCount(post.savesCount || post.saves?.length || 0);
  }, [post]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await api.post(`/api/post/like/${post._id}`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (err) {
      console.error('Like error:', err);
      alert(err.response?.data?.message || 'Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to save posts');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await api.post(`/api/post/save/${post._id}`);
      setSaved(response.data.saved);
      setSavesCount(response.data.savesCount);
    } catch (err) {
      console.error('Save error:', err);
      alert(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const imageUrl = post.image 
    ? `http://3.108.254.144/${post.image.startsWith('/') ? post.image.slice(1) : post.image}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const isVideo = post.image && /\.(mp4|webm|ogg)$/i.test(post.image);

  return (
    <div 
      className={`post-card ${isAdmin ? 'admin-card' : ''}`}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <Link to={`/posts/${post._id}`} className="post-card-link">
        <div className="post-media-container">
          {isVideo ? (
            <video 
              className="post-media" 
              src={imageUrl}
              muted
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
          ) : (
            <img 
              className="post-media" 
              src={imageUrl} 
              alt={post.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
              }}
            />
          )}
          
          {showOverlay && !isAdmin && (
            <div className="post-overlay">
              <h3 className="post-overlay-title">{post.title}</h3>
            </div>
          )}
        </div>

        <div className="post-content">
          <h3 className="post-title">{post.title}</h3>
          <p className="post-description" title={post.description}>
            {post.description && post.description.length > 100
              ? `${post.description.substring(0, 100)}...`
              : post.description || 'No description'}
          </p>
          
          <div className="post-meta">
            <span className="post-date">{formatDate(post.createdAt)}</span>
            {!isAdmin && isAuthenticated && (
              <div className="post-actions">
                <button 
                  className={`like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={loading}
                  title={liked ? 'Unlike' : 'Like'}
                >
                  <span>{liked ? '❤️' : '🤍'}</span>
                  {likesCount > 0 && <span className="count">{likesCount}</span>}
                </button>
                <button 
                  className={`save-btn ${saved ? 'saved' : ''}`}
                  onClick={handleSave}
                  disabled={loading}
                  title={saved ? 'Unsave' : 'Save'}
                >
                  <span>{saved ? '🔖' : '📌'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {isAdmin && (
        <div className="admin-actions">
          <Link to={`/dashboard/posts/edit/${post._id}`} className="btn-edit-small">
            Edit
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onDelete) {
                onDelete(post._id);
              }
            }}
            className="btn-delete-small"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all posts and find the one with matching ID
      const response = await api.post('/api/allpost', {
        centerid: '', // Empty to get all posts
      });
      
      // Handle different response shapes
      const data = response.data;
      let postsList = [];
      if (Array.isArray(data)) {
        postsList = data;
      } else if (data && Array.isArray(data.list)) {
        postsList = data.list;
      } else if (data && Array.isArray(data.data)) {
        postsList = data.data;
      } else if (data && Array.isArray(data.posts)) {
        postsList = data.posts;
      }
      
      const foundPost = postsList.find((p) => p._id === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="page-container">
        <div className="error-message">{error || 'Post not found'}</div>
        <Link to="/posts" className="btn-primary">Back to Feed</Link>
      </div>
    );
  }

  const imageUrl = post.image
    ? `http://3.108.254.144/${post.image.startsWith('/') ? post.image.slice(1) : post.image}`
    : 'https://via.placeholder.com/800x600?text=No+Image';

  const isVideo = post.image && /\.(mp4|webm|ogg)$/i.test(post.image);

  return (
    <div className="post-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="post-detail-container">
        <div className="post-detail-media">
          {isVideo ? (
            <video src={imageUrl} controls className="detail-media" autoPlay>
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={imageUrl} 
              alt={post.title}
              className="detail-media"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error';
              }}
            />
          )}
        </div>

        <div className="post-detail-content">
          <h1 className="detail-title">{post.title}</h1>
          
          <div className="detail-meta">
            <span className="detail-date">{formatDate(post.createdAt)}</span>
            <div className="detail-actions">
              <button 
                className={`like-btn-large ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>
              <span className="view-count-large">👁️ 0 views</span>
            </div>
          </div>

          <div className="detail-description">
            <p>{post.description || 'No description available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;



/**
 * PostCard Component
 * Displays a single post with image, title, description, and action buttons
 * Handles like and save functionality
 */

import React, { useState } from 'react';
import { getImageUrl, toggleLikePost, toggleSavePost } from '../utils/api';
import './PostCard.css';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [savesCount, setSavesCount] = useState(post.savesCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle like/unlike action
  const handleLike = async () => {
    if (isLoading) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like posts');
      return;
    }
    
    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(previousLiked ? likesCount - 1 : likesCount + 1);

    try {
      const response = await toggleLikePost(post._id, token);
      
      // Update with server response
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
      
      // Notify parent component if callback provided
      if (onUpdate) {
        onUpdate({ ...post, isLiked: response.liked, likesCount: response.likesCount });
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error('Error toggling like:', error);
      
      // Show user-friendly error message
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to like post. Please try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save/unsave action
  const handleSave = async () => {
    if (isLoading) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save posts');
      return;
    }
    
    setIsLoading(true);
    const previousSaved = isSaved;
    const previousCount = savesCount;
    
    // Optimistic update
    setIsSaved(!isSaved);
    setSavesCount(previousSaved ? savesCount - 1 : savesCount + 1);

    try {
      const response = await toggleSavePost(post._id, token);
      
      // Update with server response
      setIsSaved(response.saved);
      setSavesCount(response.savesCount);
      
      // Notify parent component if callback provided
      if (onUpdate) {
        onUpdate({ ...post, isSaved: response.saved, savesCount: response.savesCount });
      }
    } catch (error) {
      // Revert on error
      setIsSaved(previousSaved);
      setSavesCount(previousCount);
      console.error('Error toggling save:', error);
      
      // Show user-friendly error message
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to save post. Please try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const imageUrl = getImageUrl(post.image);
  const creatorName = post.createdBy?.name || post.createdBy?.shopName || 'Unknown';

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-creator">
          <div className="creator-avatar">
            {creatorName.charAt(0).toUpperCase()}
          </div>
          <div className="creator-info">
            <div className="creator-name">{creatorName}</div>
            <div className="post-date">{formatDate(post.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Post Image */}
      {imageUrl && (
        <div className="post-image-container">
          <img 
            src={imageUrl} 
            alt={post.title || 'Post image'} 
            className="post-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="post-content">
        {post.title && (
          <h3 className="post-title">{post.title}</h3>
        )}
        {post.description && (
          <p className="post-description">{post.description}</p>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={isLoading}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{likesCount}</span>
        </button>

        <button 
          className={`action-btn save-btn ${isSaved ? 'active' : ''}`}
          onClick={handleSave}
          disabled={isLoading}
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isSaved ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{savesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;


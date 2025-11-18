import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles.css';

const EditPost = () => {
  const { id } = useParams();
  const { adminId } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id, adminId]);

  const fetchPost = async () => {
    setFetching(true);
    try {
      const response = await api.post('/api/allpost', {
        centerid: adminId,
      });
      
      // Handle different response shapes
      const data = response.data;
      let postsArray = [];
      if (Array.isArray(data)) {
        postsArray = data;
      } else if (data && Array.isArray(data.list)) {
        postsArray = data.list;
      } else if (data && Array.isArray(data.data)) {
        postsArray = data.data;
      } else if (data && Array.isArray(data.posts)) {
        postsArray = data.posts;
      }
      
      const post = postsArray.find((p) => p._id === id);
      if (post) {
        setFormData({
          title: post.title || '',
          description: post.description || '',
          image: null,
        });
        setExistingImage(post.image || '');
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
        if (!validTypes.includes(file.type)) {
          setError('Please select a valid image or video file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('File size should be less than 10MB');
          return;
        }
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setError('');
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await api.put(`/api/post/update/${id}`, data);
      alert('Post updated successfully!');
      navigate('/dashboard/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading post...</div>;
  }

  const existingImageUrl = existingImage
    ? `http://3.108.254.144/${existingImage.startsWith('/') ? existingImage.slice(1) : existingImage}`
    : '';

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Edit Post</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Enter post description"
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image/Video (optional - leave empty to keep current)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4"
            onChange={handleChange}
          />
          <small className="form-hint">Accepted formats: JPG, PNG, WEBP, MP4 (Max 10MB)</small>
          
          {preview ? (
            <div className="image-preview">
              {formData.image?.type?.startsWith('video/') ? (
                <video src={preview} controls className="preview-media" />
              ) : (
                <img src={preview} alt="Preview" className="preview-media" />
              )}
            </div>
          ) : existingImageUrl ? (
            <div className="image-preview">
              <p className="preview-label">Current image:</p>
              <img 
                src={existingImageUrl} 
                alt="Current" 
                className="preview-media"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dashboard/posts')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
        if (!validTypes.includes(file.type)) {
          setError('Please select a valid image or video file (jpg, png, webp, mp4)');
          return;
        }
        
        // Validate file size (10MB max)
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

    if (!formData.image) {
      setError('Please select an image or video');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('image', formData.image);

      console.log('Creating post: POST http://3.108.254.144:5000/api/post/create');
      const token = localStorage.getItem('token');
      console.log('Token present:', !!token);

      await api.post('/api/post/create', data);
      alert('Post created successfully!');
      navigate('/dashboard/posts');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Create New Post</h2>
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
          <label htmlFor="image">Image/Video *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4"
            onChange={handleChange}
            required
          />
          <small className="form-hint">Accepted formats: JPG, PNG, WEBP, MP4 (Max 10MB)</small>
          
          {preview && (
            <div className="image-preview">
              {formData.image?.type?.startsWith('video/') ? (
                <video src={preview} controls className="preview-media" />
              ) : (
                <img src={preview} alt="Preview" className="preview-media" />
              )}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
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

export default CreatePost;

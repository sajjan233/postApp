import React, { useState, useEffect } from 'react';
import { postAPI, categoryAPI } from '../api';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load categories
  useEffect(() => {
    categoryAPI.getList()
      .then((res) => {        
        setCategories(res.data);
      })
      .catch(() => setError("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type.toLowerCase()));

    if (invalidFiles.length > 0) {
      setError('Only image files allowed (JPG, PNG, GIF, WEBP)');
      return;
    }

    setImages([...images, ...files]);
    setError(null);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.categoryId) {
        setError("Please select a category");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await postAPI.createPost(formDataToSend);
      onPostCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="Post Title *"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            className="input textarea"
            placeholder="Post Description *"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />

          {/* Category Dropdown */}
          <select
            name="categoryId"
            className="input"
            required
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category *</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="image-upload-section">
            <label className="upload-label">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 3}
              />
              <span className="upload-btn">Choose Images (Max 3)</span>
            </label>

            <p className="upload-hint">{images.length}/3 images selected</p>

            {images.length > 0 && (
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="preview-item">
                    <img src={URL.createObjectURL(image)} alt="" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

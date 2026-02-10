import React, { useState } from 'react';
import { postAPI } from '../api';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    maxNotificationPerPostPerDay: 1
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Image upload (Max 4)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      setError("Maximum 4 images allowed.");
      return;
    }

    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("maxNotificationPerPostPerDay", formData.maxNotificationPerPostPerDay);

      images.forEach((img) => data.append("images", img));

      await postAPI.createPost(data);
      onPostCreated();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
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
            value={formData.description}
            onChange={handleChange}
          />

          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            className="input"
            required
            value={formData.startDate}
            onChange={handleChange}
          />

          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            className="input"
            required
            value={formData.endDate}
            onChange={handleChange}
          />

          <label>Max Notification Per Day</label>
          <input
            type="number"
            name="maxNotificationPerPostPerDay"
            className="input"
            min="1"
            value={formData.maxNotificationPerPostPerDay}
            onChange={handleChange}
          />

          {/* Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={images.length >= 4}
          />

          {images.length > 0 && (
            <div className="image-preview">
              {images.map((img, i) => (
                <div key={i}>
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreatePostModal;

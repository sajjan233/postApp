import React, { useState, useEffect } from "react";
import { postAPI } from "../api";
import "./CreatePostModal.css";

const UpdatePostModal = ({ post, onClose, onPostUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prefill post data
  useEffect(() => {
    if (!post) return;

    setFormData({
      title: post.title || "",
      description: post.description || "",
    });

    setExistingImages(post.images || []);
  }, [post]);

  // Handle text change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;

    if (total > 3) {
      setError("Maximum 3 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      // keep existing images
      existingImages.forEach((img) =>
        data.append("existingImages[]", img)
      );

      // add new images
      newImages.forEach((img) =>
        data.append("images", img)
      );

      // ⭐ IMPORTANT: auto-image flag
      if (existingImages.length === 0 && newImages.length === 0) {
        data.append("generateImage", "true");
      }

      await postAPI.updatePost(post._id, data);

      onPostUpdated();
      onClose();
    } catch (err) {
      setError("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="input textarea"
            name="description"
            placeholder="Post Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="image-preview">
              {existingImages.map((img, i) => (
                <div key={i} className="preview-item">
                  <img src={img} alt="" />
                  <button type="button" onClick={() => removeExistingImage(i)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

          {newImages.length > 0 && (
            <div className="image-preview">
              {newImages.map((img, i) => (
                <div key={i} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeNewImage(i)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModal;

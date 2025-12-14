import React, { useState, useEffect } from 'react';
import { postAPI, categoryAPI } from '../api';
import './CreatePostModal.css';

const UpdatePostModal = ({ post, onClose, onPostUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: ''
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load main categories
  useEffect(() => {
    categoryAPI.getList()
      .then(res => setMainCategories(res.data))
      .catch(() => setError('Failed to load categories'));
  }, []);

  // Prefill post data
  useEffect(() => {
    if (!post) return;

    setFormData({
      title: post.title,
      description: post.description,
      categoryId: post.categoryId?._id || ''
    });

    setSelectedMainCategory(post.categoryId?.parent || post.categoryId?._id);
    setExistingImages(post.images || []);

    if (post.categoryId?.parent) {
      loadSubCategories(post.categoryId.parent);
    }
  }, [post]);

  const loadSubCategories = async (parentId) => {
    try {
      const res = await categoryAPI.getByParent(parentId);
      setSubCategories(res.data);
    } catch {
      setSubCategories([]);
    }
  };

  const handleMainCategoryChange = async (e) => {
    const id = e.target.value;
    setSelectedMainCategory(id);
    setFormData({ ...formData, categoryId: '' });

    if (id) await loadSubCategories(id);
    else setSubCategories([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new images
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const total = existingImages.length + newImages.length + files.length;

  if (total > 3) {
    setError('Maximum 3 images allowed');
    return;
  }

  // Immediately update state
  setNewImages(prev => [...prev, ...files]);
};


  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const finalCategoryId = formData.categoryId || selectedMainCategory;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', finalCategoryId);

    // Existing images URLs
    existingImages.forEach(img => data.append('existingImages[]', img));

    // New images files
    newImages.forEach(img => data.append('images', img));

    
    await postAPI.updatePost(post._id, data);

    setNewImages([]);
    onPostUpdated();
    onClose();
  } catch (err) {
    setError('Failed to update post');
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
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="input textarea"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <select className="input" onChange={handleMainCategoryChange} value={selectedMainCategory}>
            <option value="">Select Main Category</option>
            {mainCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            className="input"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Sub Category</option>
            {subCategories.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="image-preview">
              {existingImages.map((img, i) => (
                <div key={i} className="preview-item">
                  <img src={img} alt="" />
                  <button type="button" onClick={() => removeExistingImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* New images */}
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {newImages.length > 0 && (
            <div className="image-preview">
              {newImages.map((img, i) => (
                <div key={i} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeNewImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModal;

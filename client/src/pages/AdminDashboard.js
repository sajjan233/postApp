import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../api';
import CreatePostModal from '../components/CreatePostModal';
import QRCodeDisplay from '../components/QRCodeDisplay';
import LinkQRGenerator from '../components/LinkQRGenerator'; // ✅ POPUP
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
const userReferralCode = user.referralCode
    if (!token || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadPosts();
  }, [navigate]);

  const loadPosts = async () => {
    try {
      const response = await postAPI.getAdminPosts();
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    loadPosts();
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

  const user = JSON.parse(localStorage.getItem('user') || '{}');
const userReferralCode = user.referralCode

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <div className="header-actions">

          {/* ✅ QR POPUP BUTTON */}
          <button
            className="btn btn-primary"
            onClick={() => setShowQRModal(true)}
          >
            Generate QR
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Post
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
        </div>

        <div className="posts-section">
          <h2>Your Posts</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="post-item">
                  {post.images && post.images.length > 0 && (
                    <div className="post-item-image">
                      <img
                        src={`${API_BASE_URL}${post.images[0]}`}
                        alt={post.title}
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  <div className="post-item-content">
                    <h3>{post.title}</h3>
                    <p className="post-item-description">
                      {post.description.substring(0, 100)}...
                    </p>
                    <p className="post-item-date">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* ✅ QR GENERATOR POPUP */}
      {showQRModal && (
       <LinkQRGenerator 
  onClose={() => setShowQRModal(false)} 
  referralCode={userReferralCode} 
/>
      )}

    </div>
  );
};

export default AdminDashboard;

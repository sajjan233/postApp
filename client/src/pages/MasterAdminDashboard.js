import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, adminAPI, searchAPI } from '../api';
import CreatePostModal from '../components/CreatePostModal';
import './MasterAdminDashboard.css';

const MasterAdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'masterAdmin') {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [postsResponse, adminsResponse] = await Promise.all([
        postAPI.getAllPosts(),
        searchAPI.searchAdmins('') // Get all admins
      ]);
      setPosts(postsResponse.data.posts);
      setAdmins(adminsResponse.data.admins || []);
    } catch (err) {
      console.error('Failed to load data:', err);
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
    loadData();
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

  return (
    <div className="master-admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Master Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Global Post
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Admins</h3>
            <p className="stat-number">{admins.length}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h2>All Posts</h2>
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet.</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post._id} className="post-item-full">
                    {post.images && post.images.length > 0 && (
                      <div className="post-item-image">
                        <img
                          src={`http://localhost:5000${post.images[0]}`}
                          alt={post.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      </div>
                    )}
                    <div className="post-item-content">
                      <div className="post-meta">
                        <span className="admin-badge">
                          {post.adminId?.role === 'masterAdmin' ? 'Global' : post.adminId?.shopName || post.adminId?.name}
                        </span>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <h2>All Admins</h2>
            {admins.length === 0 ? (
              <div className="no-posts">
                <p>No admins registered yet.</p>
              </div>
            ) : (
              <div className="admins-list">
                {admins.map((admin) => (
                  <div key={admin._id || admin.adminKey} className="admin-item">
                    <div className="admin-info">
                      <h4>{admin.shopName || admin.name}</h4>
                      <p>{admin.name}</p>
                      {admin.phone && <p>Phone: {admin.phone}</p>}
                      {admin.pincode && <p>Pincode: {admin.pincode}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default MasterAdminDashboard;



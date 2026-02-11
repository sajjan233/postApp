import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, searchAPI } from '../api';
import CreatePostModal from '../components/CreatePostModal';
import EditAdminNotificationModal from '../components/EditAdminNotificationModal';
import './MasterAdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const MasterAdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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
    setLoading(true);
    try {
      const [postsResponse, adminsResponse] = await Promise.all([
        postAPI.getAllPosts(),
        searchAPI.searchAdmins('')
      ]);

      setPosts(postsResponse.data.posts || []);
      setAdmins(adminsResponse.data.admins || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    loadData();
  };

  const handleAdminUpdated = () => {
    setShowEditAdminModal(false);
    setSelectedAdmin(null);
    loadData();
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="master-admin-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Master Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/all/queries')}
          >
            All Query
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Global Post
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* STATS */}
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
          {/* POSTS */}
          <div className="section">
            <h2>All Posts</h2>

            {loading ? (
              <div className="loading">
                <div className="spinner" />
              </div>
            ) : posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post._id} className="post-item-full">
                    {post.images?.length > 0 && (
                      <div className="post-item-image">
                        <img
                          src={`${API_BASE_URL}${post.images[0]}`}
                          alt={post.title}
                          onError={(e) =>
                            (e.target.src = 'https://via.placeholder.com/300')
                          }
                        />
                      </div>
                    )}

                    <div className="post-item-content">
                      <div className="post-meta">
                        <span className="admin-badge">
                          {post.adminId?.role === 'masterAdmin'
                            ? 'Global'
                            : post.adminId?.shopName || post.adminId?.name}
                        </span>
                        <span className="post-date">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADMINS */}
          <div className="section">
            <h2>All Admins</h2>

            <div className="admins-list">
              {admins.map((admin) => (
                <div key={admin._id} className="admin-item">
                  <div className="admin-info">
                    <h4>{admin.shopName || admin.name}</h4>
                    <p>{admin.phone}</p>
                    <p>{admin.pincode}</p>
                  </div>

                  <button
                    className="btn btn-small"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowEditAdminModal(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {showEditAdminModal && selectedAdmin && (
        <EditAdminNotificationModal
          admin={selectedAdmin}
          onClose={() => {
            setShowEditAdminModal(false);
            setSelectedAdmin(null);
          }}
          onUpdated={handleAdminUpdated}
        />
      )}
    </div>
  );
};

export default MasterAdminDashboard;

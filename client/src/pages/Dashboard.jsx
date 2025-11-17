import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles.css';

const Dashboard = () => {
  const { adminId } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [adminId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch users count
      const usersRes = await api.post('/api/user/list');
      const usersList = Array.isArray(usersRes.data) 
        ? usersRes.data 
        : (usersRes.data?.data || usersRes.data?.list || []);
      
      // Fetch posts count
      const postsRes = await api.post('/api/allpost', { centerid: adminId || '' });
      const postsList = Array.isArray(postsRes.data)
        ? postsRes.data
        : (postsRes.data?.data || postsRes.data?.list || postsRes.data?.posts || []);
      
      setStats({
        users: usersList.length,
        posts: postsList.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your admin dashboard</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.users}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📸</div>
              <div className="stat-content">
                <h3>{stats.posts}</h3>
                <p>Total Posts</p>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/dashboard/posts/create" className="action-card action-primary">
                <span className="action-icon">➕</span>
                <h3>Create Post</h3>
                <p>Add a new post to the feed</p>
              </Link>
              
              <Link to="/dashboard/posts" className="action-card">
                <span className="action-icon">📋</span>
                <h3>Manage Posts</h3>
                <p>View and edit your posts</p>
              </Link>
              
              <Link to="/dashboard/users" className="action-card">
                <span className="action-icon">👥</span>
                <h3>View Users</h3>
                <p>See all registered users</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

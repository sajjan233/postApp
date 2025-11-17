import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import '../styles.css';

const Profile = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'liked'
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      fetchPosts();
    }
  }, [activeTab, profile]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching profile: GET http://localhost:5000/auth/me');
      const response = await api.get('/auth/me');
      console.log('Profile response:', response.data);
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const postIds = activeTab === 'saved' ? profile.savedPosts : profile.likedPosts;
      
      if (!postIds || postIds.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Fetch all posts and filter by IDs
      const response = await api.post('/api/allpost', { centerid: '' });
      const data = response.data;
      let allPosts = [];
      
      if (Array.isArray(data)) {
        allPosts = data;
      } else if (data && Array.isArray(data.list)) {
        allPosts = data.list;
      } else if (data && Array.isArray(data.data)) {
        allPosts = data.data;
      } else if (data && Array.isArray(data.posts)) {
        allPosts = data.posts;
      }

      // Filter posts by saved/liked IDs
      const filteredPosts = allPosts.filter(post => 
        postIds.some(id => id._id === post._id || id === post._id)
      );
      
      setPosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/posts');
  };

  if (loading && !profile) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {profile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-details">
            <h1>{profile?.name || 'User'}</h1>
            <p className="profile-email">{profile?.email}</p>
            {profile?.shopName && (
              <p className="profile-shop">🏪 {profile.shopName}</p>
            )}
            {profile?.nearby && (
              <p className="profile-location">📍 {profile.nearby}</p>
            )}
            {profile?.pinCode && (
              <p className="profile-pincode">📮 {profile.pinCode}</p>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Posts ({profile?.savedPosts?.length || 0})
        </button>
        <button
          className={`tab-button ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          Liked Posts ({profile?.likedPosts?.length || 0})
        </button>
      </div>

      {loading ? (
        <div className="posts-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No {activeTab} posts yet</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} isAdmin={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;



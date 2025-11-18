import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { adminId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (adminId) {
      fetchPosts();
    }
  }, [adminId]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/allpost', {
        centerid: adminId,
      });
      console.log("response.data", response.data);
      
      // Ensure we always have an array
      const data = response.data;
      console.log("data",data);
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data && Array.isArray(data.list)) {
        setPosts(data.list);
      } else if (data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/api/post/delete/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Ensure posts is always an array before rendering
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div className="page-container">
      <h2>Posts List</h2>
      
      {postsArray.length === 0 ? (
        <p>No posts found. <Link to="/dashboard/create-post">Create your first post</Link></p>
      ) : (
        <div className="posts-grid">
          {postsArray.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-image">
                <img
                  src={`http://3.108.254.144${post.image}`}
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = `http://3.108.254.144${post.image}`;
                  }}
                />
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-description">
                  {post.description && post.description.length > 100
                    ? `${post.description.substring(0, 100)}...`
                    : post.description || ''}
                </p>
                <div className="post-actions">
                  <Link to={`/dashboard/edit-post/${post._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;


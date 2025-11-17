import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import ConfirmModal from '../components/ConfirmModal';
import '../styles.css';

const PostsListAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });
  const { adminId } = useAuth();

  useEffect(() => {
    if (adminId) {
      fetchPosts();
    }
  }, [adminId]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching posts: POST http://localhost:5000/api/allpost', { centerid: adminId });
      const token = localStorage.getItem('token');
      console.log('Token present:', !!token);
      
      const response = await api.post('/api/allpost', {
        centerid: adminId,
      });
      console.log('Posts response:', response.data);
      
      // Handle different response shapes
      const postsList = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || response.data?.list || response.data?.posts || []);
      
      setPosts(postsList);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/api/post/delete/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      setDeleteModal({ isOpen: false, postId: null });
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Posts</h2>
        <Link to="/dashboard/posts/create" className="btn-primary">
          Create New Post
        </Link>
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
          <p>No posts found. <Link to="/dashboard/posts/create">Create your first post</Link></p>
        </div>
      ) : (
        <div className="posts-grid admin-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isAdmin={true}
              onDelete={(id) => setDeleteModal({ isOpen: true, postId: id })}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={() => handleDelete(deleteModal.postId)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default PostsListAdmin;



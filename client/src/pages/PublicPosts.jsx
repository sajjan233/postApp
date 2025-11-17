import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import '../styles.css';

const PublicPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetchPosts();

    // Initialize Socket.io connection
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Listen for newPost events
    socket.on('newPost', (newPost) => {
      console.log('📢 Received newPost event:', newPost);
      
      // Add new post to the beginning of the list with animation
      setPosts((prevPosts) => {
        // Check if post already exists (avoid duplicates)
        const exists = prevPosts.some(p => p._id === newPost._id);
        if (exists) {
          return prevPosts;
        }
        
        // Add new post at the beginning with a highlight flag for animation
        const postWithHighlight = {
          ...newPost,
          isNew: true, // Flag to trigger special animation
        };
        
        // Remove highlight flag after animation completes
        setTimeout(() => {
          setPosts((currentPosts) =>
            currentPosts.map((p) =>
              p._id === newPost._id ? { ...p, isNew: false } : p
            )
          );
        }, 1000);
        
        return [postWithHighlight, ...prevPosts];
      });

      // Show a subtle notification (optional)
      console.log('✨ New post added to feed:', newPost.title);
    });

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching public posts: POST http://localhost:5000/api/allpost');
      const response = await api.post('/api/allpost', {
        centerid: '', // Empty for all posts
      });
      console.log('Public posts response:', response.data);
      
      // Handle different response shapes
      const data = response.data;
      let postsList = [];
      if (Array.isArray(data)) {
        postsList = data;
      } else if (data && Array.isArray(data.list)) {
        postsList = data.list;
      } else if (data && Array.isArray(data.data)) {
        postsList = data.data;
      } else if (data && Array.isArray(data.posts)) {
        postsList = data.posts;
      }
      
      setPosts(postsList);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.shopName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="public-posts-page">
      <div className="feed-header">
        <h1>Feed</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="posts-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>{searchQuery ? 'No posts found matching your search' : 'No posts available'}</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post, index) => (
            <div 
              key={post._id} 
              className={`post-card-wrapper ${post.isNew ? 'new-post' : ''}`}
              style={{ animationDelay: post.isNew ? '0s' : `${index * 0.05}s` }}
            >
              <PostCard post={post} isAdmin={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPosts;

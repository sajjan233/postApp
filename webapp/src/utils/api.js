/**
 * API Utility Functions
 * Reusable functions for making API calls to the backend
 */

import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL, API_ENDPOINTS } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Add /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Get all posts (public endpoint - no auth required)
 * @param {Object} filters - Optional filters (e.g., { centerid: '...' })
 * @returns {Promise} API response with posts list
 */
export const getAllPosts = async (filters = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.POSTS.ALL, filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Like/Unlike a post
 * @param {string} postId - ID of the post to like/unlike
 * @param {string} token - JWT token (required for authenticated users)
 * @returns {Promise} API response with like status
 */
export const toggleLikePost = async (postId, token = null) => {
  try {
    if (!token) {
      throw new Error('Authentication required to like posts');
    }
    const headers = { 'x-auth-token': token };
    const response = await api.post(
      API_ENDPOINTS.POSTS.LIKE(postId),
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Save/Unsave a post
 * @param {string} postId - ID of the post to save/unsave
 * @param {string} token - JWT token (required for authenticated users)
 * @returns {Promise} API response with save status
 */
export const toggleSavePost = async (postId, token = null) => {
  try {
    if (!token) {
      throw new Error('Authentication required to save posts');
    }
    const headers = { 'x-auth-token': token };
    const response = await api.post(
      API_ENDPOINTS.POSTS.SAVE(postId),
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
};

/**
 * Get image URL - constructs full URL for post images
 * @param {string} imagePath - Relative image path from server
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath}`;
};

/**
 * Register Admin
 * POST /api/admin/register
 */
export const registerAdmin = async (data) => {
  try {
    const response = await api.post('/admin/register', data);
    return response.data;
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
};

/**
 * Login Admin
 * POST /api/admin/login
 */
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/admin/by/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Search Admins
 * GET /api/admins/search?query=
 */
export const searchAdmins = async (query) => {
  try {
    const response = await api.get('/admins/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching admins:', error);
    throw error;
  }
};

/**
 * Get Admin by adminKey
 * GET /api/admins/:adminKey
 */
export const getAdminByKey = async (adminKey) => {
  try {
    const response = await api.get(`/admin/${adminKey}`);
    return response.data;
  } catch (error) {
    console.error('Error getting admin by key:', error);
    throw error;
  }
};

/**
 * Select Admin (Link customer to admin)
 * POST /api/customer/select-admin
 */
export const selectAdmin = async (adminKey, customerId = null) => {
  try {
    const response = await api.post('/customer/select-admin', {
      adminKey,
      customerId,
    });
    return response.data;
  } catch (error) {
    console.error('Error selecting admin:', error);
    throw error;
  }
};

/**
 * Get Post Feed
 * GET /api/posts/feed?customerId=
 */
export const getPostFeed = async (customerId) => {
  try {
    const response = await api.get('/posts/feed', { params: { customerId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};

/**
 * Get Post by ID
 * GET /api/posts/:id
 */
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

/**
 * Create Post (Admin only)
 * POST /api/posts/create
 */
export const createPost = async (formData, token) => {
  try {
    const headers = {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data',
    };
    const response = await api.post('/posts/create', formData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export default api;


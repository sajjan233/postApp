/**
 * Application Constants
 * Centralized configuration for environment variables and constants
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Socket.io Configuration
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Image Base URL
export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || API_BASE_URL;

// Google AdSense Configuration
export const ADSENSE_PUBLISHER_ID = process.env.REACT_APP_ADSENSE_PUBLISHER_ID || '';

// API Endpoints
export const API_ENDPOINTS = {
  POSTS: {
    ALL: '/api/allpost',
    LIKE: (postId) => `/api/post/like/${postId}`,
    SAVE: (postId) => `/api/post/save/${postId}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
};

// Color Scheme Constants
export const COLORS = {
  BLACK: '#000000',
  DARK_BLUE: '#14213D',
  ORANGE: '#FCA311',
  LIGHT_GRAY: '#E5E5E5',
  WHITE: '#FFFFFF',
};

// Application Settings
export const APP_CONFIG = {
  POSTS_PER_PAGE: 10,
  AD_FREQUENCY: 3, // Show ad after every N posts
  SOCKET_RECONNECT_DELAY: 1000,
  SOCKET_RECONNECT_ATTEMPTS: 5,
};




import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin APIs
export const adminAPI = {
  register: (data) => api.post('/admin/register', data),
  login: (data) => api.post('/admin/login', data),
  getByKey: (adminKey) => api.get(`/admin/${adminKey}`),
};

// Customer APIs
export const customerAPI = {
  selectAdmin: (data) => api.post('/customer/select-admin', data),
};

// Post APIs
export const postAPI = {
  getFeed: (customerId) => api.get(`/posts/feed?customerId=${customerId}?customerId=${customerId}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => {
    return api.post('/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAdminPosts: () => api.get('/posts/admin/my-posts'),
  getAllPosts: () => api.get('/posts/admin/all-posts'),
};

// Admin Search API
export const searchAPI = {
  searchAdmins: (query) => api.get(`/admins/search?query=${encodeURIComponent(query)}`),
};


export const categoryAPI = {
  getAll: () => api.get('/category'),
};
export default api;



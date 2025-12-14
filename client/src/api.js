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
  userregister: (data) => api.post('/admin/userregister', data),
  login: (data) => api.post('/admin/login', data),
  getByKey: (adminKey) => api.get(`/admin/by/${adminKey}`),
};

// Customer APIs
export const customerAPI = {
  selectAdmin: (data) => api.post('/customer/select-admin', data),
};

// Post APIs
export const postAPI = {
  getFeed: (customerId) => api.get(`/posts/feed?customerId=${customerId}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => {
    return api.post('/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updatePost: (id, formData) => {
    console.log("formData", formData);

    return api.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAdminPosts: () => api.get('/posts/admin/my-posts'),
  getAllPosts: () => api.get('/posts/admin/all-posts'),
  getByCategory: (categoryId) => api.get(`/posts/category/${categoryId}`),
};

// Admin Search API
export const searchAPI = {
  searchAdmins: (query) => api.get(`/admins/search?query=${encodeURIComponent(query)}`),
};


export const categoryAPI = {
  getAll: () => api.get('/category'),
  getList: () => api.get('/category'),
  getByParent: (parentId) => api.get(`/category?parentid=${parentId}`)

};

export const referralAPI = {
  // POST referral scan
  scan: (referralCode, newUserId) =>
    api.post('/referral/scan', { referralCode, newUserId })
};

// ================= QUERY APIs =================

// User side


// Admin side (token required)
export const queryAPI = {
  // sab queries dekhe
  getAll: () => api.get('/queries'),
  getMyQueries: (userToken) =>
    api.get(`/query/my`),
 createQuery: (data) =>
    api.post("/query/create", data),

  // status + admin comment update
getAllQueries: () => api.get("/query/all"),
  updateQuery: (id, data) => api.put(`/query/update/${id}`, data)
};


export default api;



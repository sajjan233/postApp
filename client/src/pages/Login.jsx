import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    token: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login API call:', 'POST http://3.108.254.144/auth/login');
      const response = await api.post('/auth/login', formData);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        const userData = {
          id: response.data.user?.id || response.data.user?._id || response.data.id,
          name: response.data.user?.name,
          email: response.data.user?.email,
          role: response.data.user?.role,
        };
        login(response.data.token, userData);
        
        // Redirect based on role - admins go to dashboard, regular users go to feed
        const isAdmin = response.data.user?.role?.toLowerCase().includes('admin') || 
                       response.data.user?.role?.toLowerCase().includes('subadmin');
        navigate(isAdmin ? '/dashboard' : '/posts');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h2>Admin Login</h2>
            <p>Welcome back! Please login to continue.</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="test@gmail.com"
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="token">Token (Optional)</label>
              <input
                type="text"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleChange}
                placeholder="Enter static token"
              />
            </div>
            
            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

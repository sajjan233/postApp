import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await adminAPI.login(formData);
      const { token, user ,referralCode} = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log("user.role",user.role);
      
      // Redirect based on role
      if (user.role === 'masterAdmin') {
        navigate('/master-admin/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <h1>POST24 LOGIN</h1>
        <p>Login to manage your posts</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="input"
            placeholder="Email *"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Password *"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/admin/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;



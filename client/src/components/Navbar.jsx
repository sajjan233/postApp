import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/posts');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/posts" className="navbar-logo">
          <span className="logo-icon">📸</span>
          <span className="logo-text">Posts</span>
        </Link>
        
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/dashboard/posts" className="nav-link">My Posts</Link>
              <Link to="/dashboard/posts/create" className="nav-link nav-cta">Create</Link>
              <button onClick={handleLogout} className="nav-link nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-cta">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


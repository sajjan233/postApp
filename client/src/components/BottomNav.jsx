import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <Link 
        to="/posts" 
        className={`bottom-nav-item ${isActive('/posts') ? 'active' : ''}`}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Feed</span>
      </Link>
      
      {isAuthenticated && (
        <Link 
          to="/dashboard/posts/create" 
          className={`bottom-nav-item ${isActive('/dashboard/posts/create') ? 'active' : ''}`}
        >
          <span className="nav-icon">➕</span>
          <span className="nav-label">Upload</span>
        </Link>
      )}
      
      {isAuthenticated && (
        <Link 
          to="/dashboard" 
          className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </Link>
      )}
      
      <Link 
        to={isAuthenticated ? "/profile" : "/login"} 
        className={`bottom-nav-item ${isActive('/login') || (isAuthenticated && isActive('/profile')) ? 'active' : ''}`}
      >
        <span className="nav-icon">{isAuthenticated ? '👤' : '🔐'}</span>
        <span className="nav-label">{isAuthenticated ? 'Profile' : 'Login'}</span>
      </Link>
    </nav>
  );
};

export default BottomNav;


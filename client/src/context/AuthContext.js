import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedAdminId = localStorage.getItem('adminId');
    
    if (token) {
      setIsAuthenticated(true);
      if (storedUserId) setUserId(storedUserId);
      if (storedAdminId) setAdminId(storedAdminId);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData.id) {
      localStorage.setItem('userId', userData.id);
      setUserId(userData.id);
      // Also set as adminId for backward compatibility
      localStorage.setItem('adminId', userData.id);
      setAdminId(userData.id);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('adminId');
    setIsAuthenticated(false);
    setUserId(null);
    setAdminId(null);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    userId,
    adminId,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


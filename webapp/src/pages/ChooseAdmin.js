/**
 * Choose Admin Page
 * First screen when customer opens the app
 * Options: Scan QR or Search Admin
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAdmins, getAdminByKey, selectAdmin } from '../utils/api';
import { getImageUrl } from '../utils/api';
import './ChooseAdmin.css';

const ChooseAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'qr'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState('');

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchAdmins(searchQuery);
      setSearchResults(response.admins || []);
      if (response.admins.length === 0) {
        setError('No admins found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code input
  const handleQrSubmit = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) {
      setError('Please enter or scan a QR code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get admin by adminKey
      const adminResponse = await getAdminByKey(qrCode.trim());
      
      // Select admin (create customer if needed)
      const selectResponse = await selectAdmin(qrCode.trim());
      
      // Store customer ID and active admin in localStorage
      localStorage.setItem('customerId', selectResponse.customer.id);
      localStorage.setItem('activeAdmin', JSON.stringify(selectResponse.admin));
      
      // Redirect to feed
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid QR code');
    } finally {
      setLoading(false);
    }
  };

  // Handle admin selection
  const handleSelectAdmin = async (admin) => {
    setLoading(true);
    setError(null);

    try {
      // Get or create customer ID
      let customerId = localStorage.getItem('customerId');
      
      // Select admin
      const response = await selectAdmin(admin.adminKey, customerId);
      
      // Store customer ID and active admin
      localStorage.setItem('customerId', response.customer.id);
      localStorage.setItem('activeAdmin', JSON.stringify(response.admin));
      
      // Redirect to feed
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to select admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="choose-admin-page">
      <div className="choose-admin-container">
        <h1 className="page-title">Choose Your Admin</h1>
        <p className="page-subtitle">Select an admin to view their posts</p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Admin
          </button>
          <button
            className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            Scan QR Code
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by name, shop, phone, pincode, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                disabled={loading}
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>Search Results ({searchResults.length})</h3>
                {searchResults.map((admin) => (
                  <div key={admin.id} className="admin-card" onClick={() => handleSelectAdmin(admin)}>
                    <div className="admin-info">
                      <h4>{admin.name}</h4>
                      {admin.shopName && <p className="shop-name">{admin.shopName}</p>}
                      {admin.mobile && <p className="admin-detail">📞 {admin.mobile}</p>}
                      {admin.pinCode && <p className="admin-detail">📍 {admin.pinCode}</p>}
                      {admin.famousPlace && <p className="admin-detail">🏛️ {admin.famousPlace}</p>}
                    </div>
                    <button className="select-btn">Select</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="qr-section">
            <form onSubmit={handleQrSubmit} className="qr-form">
              <input
                type="text"
                placeholder="Enter QR code or scan..."
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="qr-input"
                disabled={loading}
              />
              <button type="submit" className="qr-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </form>
            <p className="qr-hint">
              💡 Scan the QR code provided by your admin, or enter the code manually
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseAdmin;


import React, { useState } from 'react';
import { customerAPI, searchAPI } from '../api';
import './AdminSearch.css';

const AdminSearch = ({ onAdminSelected, onBack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selecting, setSelecting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchAPI.searchAdmins(query);
      setResults(response.data.admins);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdmin = async (admin) => {
    setSelecting(true);
    setError(null);

    try {
      // Get or create customer ID
      let customerId = localStorage.getItem('customerId');
      if (!customerId) {
        customerId = `customer_${Date.now()}`;
        localStorage.setItem('customerId', customerId);
      }

      // Select admin
      await customerAPI.selectAdmin({
        customerId,
        adminKey: admin.adminKey
      });

      onAdminSelected({
        id: admin._id || admin.id,
        name: admin.name,
        shopName: admin.shopName,
        adminKey: admin.adminKey
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to select admin. Please try again.');
      setSelecting(false);
    }
  };

  return (
    <div className="admin-search">
      <div className="admin-search-container">
        <button className="back-btn" onClick={onBack}>← Back</button>
        
        <h2>Search Admin</h2>
        <p>Search by name, shop name, phone, pincode, or famous place</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="input"
            placeholder="Enter search term..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {results.length > 0 && (
          <div className="results">
            <h3>Search Results ({results.length})</h3>
            {results.map((admin) => (
              <div key={admin._id || admin.adminKey} className="result-card">
                <h4>{admin.shopName || admin.name}</h4>
                <p><strong>Name:</strong> {admin.name}</p>
                {admin.phone && <p><strong>Phone:</strong> {admin.phone}</p>}
                {admin.pincode && <p><strong>Pincode:</strong> {admin.pincode}</p>}
                {admin.famousPlace && <p><strong>Location:</strong> {admin.famousPlace}</p>}
                <button
                  className="btn btn-success"
                  onClick={() => handleSelectAdmin(admin)}
                  disabled={selecting}
                >
                  {selecting ? 'Selecting...' : 'Select This Admin'}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="no-results">No admins found. Try a different search term.</div>
        )}
      </div>
    </div>
  );
};

export default AdminSearch;



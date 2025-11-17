import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching users: POST http://3.108.254.144:5000/api/user/list');
      const response = await api.post('/api/user/list');
      console.log('Users response:', response.data);
      
      // Handle different response shapes
      const usersList = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || response.data?.list || []);
      
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Users List</h2>
        <p>{users.length} users found</p>
      </div>
      
      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Nearby</th>
                <th>Pin Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.shopName || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.nearby || 'N/A'}</td>
                  <td>{user.pinCode || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
                      {user.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;

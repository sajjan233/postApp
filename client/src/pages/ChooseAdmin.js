import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import AdminSearch from '../components/AdminSearch';
import { customerAPI } from '../api';
import './ChooseAdmin.css';

const ChooseAdmin = () => {
  const [mode, setMode] = useState(null); // qr, search, name
  const [userNumber, setUserNumber] = useState('');
  const navigate = useNavigate();

  const handleAdminSelected = async (adminData) => {
    try {
      const res = await customerAPI.selectAdmin({
        customerId: null,
        adminKey: adminData.adminKey,
        adminId: adminData.id,
        name: adminData.name
      });

      localStorage.setItem('activeUser', JSON.stringify(res.data));
      navigate('/feed');

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleNameSubmit = async () => {
    if (!userNumber.toString() || userNumber.toString().length != 10) {
      alert("Please enter your number");
      return;
    }

    try {
      const res = await customerAPI.selectAdmin({
        customerId: null,
        adminKey: null,
        adminId: null,
        number: userNumber
      });

      // Save response data
      let data = res?.data ? res?.data : {}
      localStorage.setItem('activeUser', JSON.stringify(data));
      localStorage.setItem('customerId', data?.customerId);
      

      navigate('/feed');
    } catch (err) {
      console.error("Skip Submit Error:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // QR Mode
  if (mode === 'qr') {
    return <QRScanner onAdminSelected={handleAdminSelected} onBack={() => setMode(null)} />;
  }

  // Search Mode
  if (mode === 'search') {
    return <AdminSearch onAdminSelected={handleAdminSelected} onBack={() => setMode(null)} />;
  }

  // Name Input After Skip
  if (mode === 'name') {
    return (
      <div className="choose-admin">
        <div className="choose-admin-container">
          <h1>Enter Your Number</h1>

          <input
            className="name-input"
            type="number"
            placeholder="Your Number"
            value={userNumber}
            onChange={(e) => setUserNumber(e.target.value)}
          />

          <button className="submit-btn" onClick={handleNameSubmit}>
            Submit
          </button>

          <button className="back-btn" onClick={() => setMode(null)}>
            🔙 Back
          </button>
        </div>
      </div>
    );
  }

  // Main Home Screen
  return (
    <div className="choose-admin">
      <div className="choose-admin-container">
        <h1>Welcome to PostWala</h1>
        <p className="subtitle">Choose how you want to connect</p>

        <div className="options">

          <button className="option-btn" onClick={() => setMode('qr')}>
            <div className="icon">📷</div>
            <h2>Scan QR Code</h2>
            <p>Scan the QR code from your shop</p>
          </button>

          <button className="option-btn" onClick={() => setMode('search')}>
            <div className="icon">🔍</div>
            <h2>Search Admin</h2>
            <p>Find admin by name or phone</p>
          </button>

          <button className="option-btn" onClick={() => setMode('name')}>
            <div className="icon">⏭️</div>
            <h2>Skip</h2>
            <p>Continue without selecting admin</p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ChooseAdmin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [step2Data, setStep2Data] = useState({
    name: '',
    shopName: '',
    nearby: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleStep1Change = (e) => {
    setStep1Data({
      ...step1Data,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleStep2Change = (e) => {
    setStep2Data({
      ...step2Data,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (step1Data.password !== step1Data.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (step1Data.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('Register Step 1: POST http://3.108.254.144/auth/register/step1');
      const response = await api.post('/auth/register/step1', {
        mobile: step1Data.mobile,
        email: step1Data.email,
        password: step1Data.password,
      });
      console.log('Step 1 response:', response.data);
      
      setUserId(response.data.userId);
      setStep(2);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Register Step 2: POST http://3.108.254.144/auth/register/step2');
      const response = await api.post('/auth/register/step2', {
        userId,
        name: step2Data.name,
        shopName: step2Data.shopName,
        nearby: step2Data.nearby,
        pinCode: step2Data.pinCode,
      });
      console.log('Step 2 response:', response.data);
      
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Profile completion error:', err);
      setError(err.response?.data?.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h2>Create Account</h2>
            <p>{step === 1 ? 'Step 1 of 2: Basic Information' : 'Step 2 of 2: Complete Your Profile'}</p>
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="login-form">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={step1Data.mobile}
                  onChange={handleStep1Change}
                  required
                  placeholder="Enter mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={step1Data.email}
                  onChange={handleStep1Change}
                  required
                  placeholder="Enter email address"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={step1Data.password}
                  onChange={handleStep1Change}
                  required
                  placeholder="Enter password (min 6 characters)"
                  autoComplete="new-password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={step1Data.confirmPassword}
                  onChange={handleStep1Change}
                  required
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="login-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={step2Data.name}
                  onChange={handleStep2Change}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shopName">Shop Name *</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={step2Data.shopName}
                  onChange={handleStep2Change}
                  required
                  placeholder="Enter shop name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nearby">Nearby Location *</label>
                <input
                  type="text"
                  id="nearby"
                  name="nearby"
                  value={step2Data.nearby}
                  onChange={handleStep2Change}
                  required
                  placeholder="e.g., A B C School"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pinCode">Pin Code *</label>
                <input
                  type="number"
                  id="pinCode"
                  name="pinCode"
                  value={step2Data.pinCode}
                  onChange={handleStep2Change}
                  required
                  placeholder="Enter pin code"
                  min="100000"
                  max="999999"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          <div className="login-footer">
            <p>
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



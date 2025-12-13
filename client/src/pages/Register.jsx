import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { referralAPI } from "../api";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref);
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register user
      const res = await axios.post("/api/auth/register", { ...formData });
      const { token, user } = res.data;
      localStorage.setItem("token", token);

      // 2️⃣ Call referral API if referralCode exists
      if (referralCode) {
        await referralAPI.scan(referralCode, user._id, token);
      }

      navigate("/feed");

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="register-box">
      <h2>Create Account</h2>
      {referralCode && <p>🎉 You are joining via referral</p>}

      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

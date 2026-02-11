import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { referralAPI, adminAPI } from "../api";
import "./Register.css";
const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "",referralCode: null });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref);
  }, [location.search]);

  const handleChange = (e) => {
    console.log("referralCode",referralCode);
    
    setFormData({ ...formData,referralCode, [e.target.name]: e.target.value });
    
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register user
      console.log("formDataformData",formData);
      
      const response = await adminAPI.userregister(formData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);

      // 2️⃣ Call referral API if referralCode exists
      if (referralCode) {
     navigate("/feed");
      }


    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

 return (
  <div className="register-wrapper">
    <div className="register-box">
      <h2>Create Account</h2>

      {referralCode && (
        <p className="ref-text">🎉 You are joining via referral</p>
      )}

      <form onSubmit={handleRegister}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="number"
          placeholder="Mobile Number"
          value={formData.number}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  </div>
);

};

export default Register;

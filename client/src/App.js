import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChooseAdmin from './pages/ChooseAdmin';
import Feed from './pages/Feed';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';
import MasterAdminDashboard from './pages/MasterAdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/feed" element={<Feed />} />
           {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/master-admin/dashboard" element={<MasterAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



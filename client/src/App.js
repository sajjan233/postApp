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
import QueryPage from './pages/QueryPage';
import MasterQuerySection from './pages/MasterQuerySection';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/queries" element={<QueryPage />} />
          <Route path="/all/queries" element={<MasterQuerySection />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/master-admin/dashboard" element={<MasterAdminDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



/**
 * Main App Component
 * Public website React application
 * Displays post feed with real-time updates via Socket.io
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import ChooseAdmin from './pages/ChooseAdmin';
import Feed from './pages/Feed';
import PostDetails from './pages/PostDetails';
import PostFeed from './components/PostFeed'; // Keep for backward compatibility
import './App.css';

function App() {
  // Check if user has selected an admin on initial load
  useEffect(() => {
    const activeAdmin = localStorage.getItem('activeAdmin');
    const customerId = localStorage.getItem('customerId');
    
    // If no admin selected, redirect to choose-admin
    if (!activeAdmin || !customerId) {
      // Will be handled by route guards
    }
  }, []);

  return (
    <SocketProvider>
      <Router>
        <div className="App">
          {/* Main Content */}
          <main className="app-main">
            <Routes>
              {/* Default route - redirect to choose-admin or feed */}
              <Route 
                path="/" 
                element={
                  localStorage.getItem('activeAdmin') 
                    ? <Navigate to="/feed" replace /> 
                    : <Navigate to="/choose-admin" replace />
                } 
              />
              
              {/* Choose Admin Page */}
              <Route path="/choose-admin" element={<ChooseAdmin />} />
              
              {/* Feed Page (Reels style) */}
              <Route path="/feed" element={<Feed />} />
              
              {/* Post Details Page */}
              <Route path="/post/:id" element={<PostDetails />} />
              
              {/* Legacy route (backward compatibility) */}
              <Route path="/legacy-feed" element={<PostFeed />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PostsListAdmin from './pages/PostsListAdmin';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PublicPosts from './pages/PublicPosts';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import './styles.css';

// Layout component with Navbar and BottomNav
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <BottomNav />
    </>
  );
};

// Dashboard Layout
const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes - Posts Feed (No login required) */}
      <Route
        path="/"
        element={
          <Layout>
            <PublicPosts />
          </Layout>
        }
      />
      <Route
        path="/posts"
        element={
          <Layout>
            <PublicPosts />
          </Layout>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <Layout>
            <PostDetail />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/posts" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/posts" replace /> : <Register />}
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />

      {/* Admin Protected Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<PostsListAdmin />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="posts/edit/:id" element={<EditPost />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;


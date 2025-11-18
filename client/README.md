# CSC Poster App - React Client

Complete React web application for CSC Poster management.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will run on `http://3.108.254.144:3000`

## Features

- ✅ Admin Login with API authentication
- ✅ Protected Routes
- ✅ Admin Dashboard
- ✅ Users List
- ✅ Posts CRUD (Create, Read, Update, Delete)
- ✅ Public Posts Page
- ✅ File Upload support
- ✅ Responsive UI

## API Configuration

Make sure your backend server is running on `http://3.108.254.144`

## Default Login Credentials

- Email: `test@gmail.com`
- Password: `Sajjan@#123`
- Token: `<static-token>` (check with your backend)

## Project Structure

```
src/
 ├─ api/
 │   └─ axios.js          # Axios configuration
 ├─ context/
 │   └─ AuthContext.js    # Authentication context
 ├─ pages/
 │   ├─ Login.jsx         # Admin login page
 │   ├─ Dashboard.jsx     # Admin dashboard layout
 │   ├─ Users.jsx         # Users list page
 │   ├─ Posts.jsx         # Posts list (admin)
 │   ├─ CreatePost.jsx    # Create post form
 │   ├─ EditPost.jsx      # Edit post form
 │   └─ PublicPosts.jsx   # Public posts page
 ├─ components/
 │   └─ ProtectedRoute.jsx # Route protection component
 ├─ App.js                # Main app component with routes
 ├─ index.js              # Entry point
 └─ styles.css            # Global styles
```



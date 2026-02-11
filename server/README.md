# PostWala - Multi-Role Post Management System

A full-stack application with three user roles: Master Admin, Admin, and Customer. Built with Node.js, MongoDB, and React.

## Features

### User Roles

1. **Master Admin** - Full access to everything
   - Create global posts (visible to all customers)
   - View all admins and posts
   - Full system management

2. **Admin** - Shop owners
   - Register and login
   - Create posts with up to 3 images
   - View own posts
   - Unique QR code for customer linking

3. **Customer** - End users
   - No login required
   - Select admin via QR scan or search
   - View feed of posts from selected admin + master admin posts
   - Instagram Reels-style vertical feed

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios
- HTML5 QR Code Scanner

## Project Structure

```
postwala/
├── server.js                 # Main server file
├── package.json
├── models/                   # Mongoose models
│   ├── User.js
│   ├── Post.js
│   └── CustomerAdminMap.js
├── routes/                   # API routes
│   ├── adminRoutes.js
│   ├── customerRoutes.js
│   ├── postRoutes.js
│   └── adminSearchRoutes.js
├── controllers/              # Route controllers
│   ├── adminController.js
│   ├── customerController.js
│   ├── postController.js
│   └── adminSearchController.js
├── middleware/               # Middleware
│   └── auth.js
├── uploads/                  # Uploaded images (created automatically)
└── webapp/                   # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── ChooseAdmin.js
    │   │   ├── Feed.js
    │   │   ├── PostDetails.js
    │   │   ├── AdminLogin.js
    │   │   ├── AdminDashboard.js
    │   │   └── MasterAdminDashboard.js
    │   ├── components/
    │   │   ├── QRScanner.js
    │   │   ├── AdminSearch.js
    │   │   ├── PostCard.js
    │   │   └── CreatePostModal.js
    │   ├── api.js            # API service
    │   └── App.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/postwala
PORT=5000
JWT_SECRET=your-secret-key-here-change-this
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to webapp directory:
```bash
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the webapp directory (optional):
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the React app:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Admin Endpoints
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login
- `GET /admin/:adminKey` - Get admin by adminKey

### Customer Endpoints
- `POST /customer/select-admin` - Link customer to admin

### Post Endpoints
- `POST /posts/create` - Create new post (requires auth)
- `GET /posts/feed?customerId=` - Get customer feed
- `GET /posts/:id` - Get single post
- `GET /posts/admin/my-posts` - Get admin's posts (requires auth)
- `GET /posts/admin/all-posts` - Get all posts (master admin only)

### Search Endpoints
- `GET /admins/search?query=` - Search admins

## Usage Guide

### Creating a Master Admin

You'll need to create a master admin manually in MongoDB or through a script:

```javascript
const User = require('./models/User');
const user = new User({
  name: 'Master Admin',
  email: 'master@admin.com',
  password: 'your-password',
  role: 'masterAdmin'
});
await user.save();
```

### Admin Registration Flow

1. Admin registers via `/admin/register` with:
   - name, email/phone, password
   - shopName, pincode, famousPlace (optional)

2. Admin receives:
   - JWT token
   - Unique `adminKey` (UUID) for QR code

3. Admin can generate QR code containing the `adminKey`

### Customer Flow

1. Customer opens app → sees "Choose Admin" screen
2. Options:
   - **Scan QR**: Opens camera scanner, scans admin's QR code
   - **Search Admin**: Searches by name, shop, phone, pincode, or location
3. After selecting admin → redirected to feed
4. Feed shows:
   - Posts from selected admin
   - Posts from master admin (global posts)

### Creating Posts

1. Admin/Master Admin logs in
2. Navigate to dashboard
3. Click "Create Post"
4. Fill in title, description
5. Upload up to 3 images
6. Post is created and visible to relevant customers

## Features

### QR Code System
- Each admin has a unique `adminKey` (UUID)
- QR code contains the `adminKey`
- When scanned, customer is linked to that admin
- Customer can be linked to multiple admins

### Search System
- Partial text search across:
  - Admin name
  - Shop name
  - Phone number
  - Pincode
  - Famous place/landmark

### Feed System
- Instagram Reels-style vertical scrolling
- Each post can have up to 3 images (carousel)
- Shows combined feed from:
  - Selected admin(s)
  - Master admin (global posts)

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)

## Notes

- Images are stored in the `uploads/` directory
- Customer IDs are stored in localStorage (no login required)
- Active admin selection is stored in localStorage
- JWT tokens are used for admin/master admin authentication
- Maximum 3 images per post
- Image upload limit: 5MB per file

## Troubleshooting

### QR Scanner not working
- Ensure camera permissions are granted
- Use HTTPS in production (required for camera access)
- Try a different browser

### Images not loading
- Check that `uploads/` directory exists
- Verify image paths in database
- Check CORS settings if frontend/backend on different domains

### MongoDB connection issues
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network access if using cloud MongoDB

## License

MIT



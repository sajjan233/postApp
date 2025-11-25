# PostWala Project Structure

## Backend Structure

```
postwala/
├── server.js                      # Main Express server
├── package.json                   # Backend dependencies
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
│
├── models/                        # Mongoose Models
│   ├── User.js                    # User model (masterAdmin, admin, customer)
│   ├── Post.js                    # Post model
│   └── CustomerAdminMap.js        # Customer-Admin mapping
│
├── routes/                        # API Routes
│   ├── adminRoutes.js             # Admin registration, login, get by key
│   ├── customerRoutes.js          # Customer select admin
│   ├── postRoutes.js              # Post CRUD operations
│   └── adminSearchRoutes.js       # Admin search endpoint
│
├── controllers/                   # Route Controllers
│   ├── adminController.js         # Admin business logic
│   ├── customerController.js      # Customer business logic
│   ├── postController.js          # Post business logic
│   └── adminSearchController.js   # Search business logic
│
├── middleware/                    # Express Middleware
│   └── auth.js                    # JWT authentication & role checking
│
├── uploads/                       # Image uploads directory (auto-created)
│
└── scripts/                       # Utility Scripts
    └── createMasterAdmin.js       # Script to create master admin
```

## Frontend Structure

```
webapp/
├── package.json                   # Frontend dependencies
├── public/
│   └── index.html                 # HTML template
│
└── src/
    ├── index.js                   # React entry point
    ├── index.css                  # Global styles
    ├── App.js                     # Main app component with routing
    ├── App.css                    # App-level styles
    │
    ├── api.js                     # Axios API service
    │
    ├── pages/                     # Page Components
    │   ├── ChooseAdmin.js         # Home screen - QR/Search selection
    │   ├── Feed.js                # Customer feed (Reels style)
    │   ├── PostDetails.js         # Single post detail view
    │   ├── AdminLogin.js          # Admin login page
    │   ├── AdminDashboard.js      # Admin dashboard
    │   └── MasterAdminDashboard.js # Master admin dashboard
    │
    ├── components/                # Reusable Components
    │   ├── QRScanner.js           # QR code scanner
    │   ├── AdminSearch.js          # Admin search component
    │   ├── PostCard.js             # Post card for feed
    │   ├── CreatePostModal.js     # Modal for creating posts
    │   └── QRCodeDisplay.js       # Display QR code for admin
    │
    └── utils/                     # Utility Functions
        └── qrGenerator.js         # QR code generation helper
```

## API Endpoints Summary

### Admin Endpoints
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login
- `GET /admin/:adminKey` - Get admin by adminKey

### Customer Endpoints
- `POST /customer/select-admin` - Link customer to admin

### Post Endpoints
- `POST /posts/create` - Create new post (auth required)
- `GET /posts/feed?customerId=` - Get customer feed
- `GET /posts/:id` - Get single post
- `GET /posts/admin/my-posts` - Get admin's posts (auth required)
- `GET /posts/admin/all-posts` - Get all posts (master admin only)

### Search Endpoints
- `GET /admins/search?query=` - Search admins (empty query returns all)

## Key Features Implemented

✅ Three-role system (masterAdmin, admin, customer)
✅ Admin registration and login with JWT
✅ QR code scanning for customer-admin linking
✅ Admin search (name, shop, phone, pincode, location)
✅ Post creation with up to 3 images
✅ Instagram Reels-style vertical feed
✅ Customer can belong to multiple admins
✅ Master admin global posts
✅ Image upload with Multer
✅ Clean folder structure
✅ Error handling and loading states
✅ Responsive UI

## Setup Commands

### Backend
```bash
npm install
npm run dev          # Development with nodemon
npm start            # Production
npm run create-master # Create master admin
```

### Frontend
```bash
cd webapp
npm install
npm start            # Development server
npm run build        # Production build
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/postwala
PORT=5000
JWT_SECRET=your-secret-key-here
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```



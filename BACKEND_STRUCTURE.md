# Backend Folder Structure

```
server/
├── src/
│   ├── models/              # NEW: Mongoose models
│   │   ├── User.js          # Updated with adminKey, famousPlace
│   │   ├── Post.js          # Updated with images array, adminId
│   │   └── CustomerAdminMap.js  # NEW: Customer-Admin mapping
│   │
│   ├── controllers/         # NEW: Controllers (business logic)
│   │   ├── adminController.js
│   │   ├── customerController.js
│   │   ├── postController.js
│   │   └── searchController.js
│   │
│   ├── routes/              # Updated routes
│   │   ├── index.js         # Main router
│   │   ├── adminRoutes.js   # NEW: Admin routes
│   │   ├── customerRoutes.js # NEW: Customer routes
│   │   └── postRoutes.js    # Updated: Post routes
│   │
│   ├── middleware/          # Existing middleware
│   │   ├── auth.js
│   │   ├── optionalAuth.js
│   │   └── upload.js        # Updated: Support multiple images
│   │
│   ├── fetchers/            # Keep existing (or migrate to controllers)
│   │   ├── user/
│   │   ├── post/
│   │   └── role/
│   │
│   └── config/
│       ├── db.js
│       └── passport.js
│
└── server.js
```


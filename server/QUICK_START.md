# Quick Start Guide

## Step 1: Install Dependencies

### Backend
```bash
npm install
```

### Frontend
```bash
cd webapp
npm install
```

## Step 2: Setup Environment Variables

### Backend
Create `.env` file in root:
```
MONGODB_URI=mongodb://localhost:27017/postwala
PORT=5000
JWT_SECRET=your-secret-key-change-this
```

### Frontend (Optional)
Create `.env` file in `webapp/`:
```
REACT_APP_API_URL=http://localhost:5000
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system.

## Step 4: Create Master Admin

```bash
npm run create-master
```

Or with custom credentials:
```bash
npm run create-master "Master Admin" "master@admin.com" "your-password"
```

## Step 5: Start Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## Step 6: Start Frontend

In a new terminal:
```bash
cd webapp
npm start
```

Frontend will start on `http://localhost:3000`

## Step 7: Test the System

### As Master Admin
1. Go to `http://localhost:3000/admin/login`
2. Login with master admin credentials
3. You'll see the master admin dashboard
4. Create a global post

### As Regular Admin
1. Go to `http://localhost:3000/admin/login`
2. Click "Register here" or go to registration endpoint
3. Register with:
   - Name, Email/Phone, Password
   - Shop Name, Pincode, Famous Place (optional)
4. Login and see your dashboard
5. Click "Show My QR Code" to see your QR code
6. Create posts

### As Customer
1. Go to `http://localhost:3000`
2. Choose "Scan QR" or "Search Admin"
3. Select an admin
4. View the feed with posts from selected admin + master admin

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify connection string in `.env`

### Port Already in Use
- Change PORT in `.env` for backend
- Change port for React: `PORT=3001 npm start`

### QR Scanner Not Working
- Grant camera permissions in browser
- Use HTTPS in production (required for camera)
- Try different browser

### Images Not Loading
- Ensure `uploads/` directory exists (created automatically)
- Check file permissions
- Verify image paths in database

## Next Steps

1. **Generate QR Codes**: Admins can display their QR codes from the dashboard
2. **Create Posts**: Admins can create posts with up to 3 images
3. **Customer Experience**: Customers can scan QR or search to connect
4. **Feed**: Customers see combined feed from selected admin + master admin

## API Testing

You can test APIs using:
- Postman
- curl
- Browser (for GET requests)

Example:
```bash
# Register Admin
curl -X POST http://localhost:5000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "test@admin.com",
    "password": "test123",
    "shopName": "Test Shop",
    "pincode": "123456",
    "famousPlace": "Test Location"
  }'
```

## Production Deployment

1. Set proper environment variables
2. Use HTTPS (required for QR scanner)
3. Configure CORS properly
4. Use production MongoDB
5. Build React app: `cd webapp && npm run build`
6. Serve React build with Express or separate server



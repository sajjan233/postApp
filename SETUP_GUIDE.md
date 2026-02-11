# Setup Guide - Post App

Complete setup instructions for running the Post App in development and production.

## Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **npm** or **yarn** package manager

## Step 1: Database Setup

1. Install MongoDB locally or create a MongoDB Atlas account
2. Get your MongoDB connection string
   - Local: `mongodb://localhost:27017/postapp`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/postapp`

## Step 2: Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server/` directory:
```env
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/postapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=300d
```

4. Start the server:
```bash
npm run server
```

The server will run on `http://localhost:5000`

## Step 3: Admin Panel Setup (client/)

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (if needed):
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

The admin panel will open at `http://localhost:3000`

## Step 4: Public Website Setup (webapp/)

1. Navigate to webapp directory:
```bash
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `webapp/` directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

The public website will open at `http://localhost:3001` (or next available port)

## Step 5: Verify Installation

1. **Backend:** Check `http://localhost:5000` - should see server running message
2. **Admin Panel:** Open `http://localhost:3000` - should see login page
3. **Public Website:** Open `http://localhost:3001` - should see post feed

## Production Deployment

### Backend

1. Update `server/.env`:
```env
NODE_ENV=production
PORT=5000
DB_URI=your-production-mongodb-uri
JWT_SECRET=strong-production-secret
CLIENT_URL=http://your-admin-panel-url.com
WEBAPP_URL=http://your-public-website-url.com
```

2. Start server:
```bash
NODE_ENV=production node server.js
```

### Frontend Builds

1. **Admin Panel:**
```bash
cd client
npm run build
# Deploy the 'build' folder to your hosting
```

2. **Public Website:**
```bash
cd webapp
npm run build
# Deploy the 'build' folder to your hosting
```

## Google AdSense Setup (Optional)

1. Sign up for Google AdSense
2. Get your Publisher ID (format: `ca-pub-XXXXXXXXXX`)
3. Update `webapp/src/components/AdSense.js`:
   - Replace `ca-pub-YOUR_PUBLISHER_ID` with your actual ID
4. Uncomment the AdSense script in `webapp/public/index.html`
5. Update the script URL with your Publisher ID

## Troubleshooting

### Port Already in Use
- Change ports in `.env` files
- Or kill the process using the port

### MongoDB Connection Error
- Verify MongoDB is running
- Check `DB_URI` in `server/.env`
- Ensure network access for cloud MongoDB

### CORS Errors
- Update CORS origins in `server/server.js`
- Add your frontend URLs to allowed origins

### Socket.io Connection Issues
- Verify backend is running
- Check `REACT_APP_SOCKET_URL` in webapp `.env`
- Ensure CORS allows Socket.io connections

## Environment Variables Summary

### Server (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode
- `DB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - Token expiration
- `CLIENT_URL` - Admin panel URL (production)
- `WEBAPP_URL` - Public website URL (production)

### Webapp (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - Socket.io server URL

## Next Steps

1. Create an admin user through the registration endpoint
2. Log in to admin panel
3. Create posts
4. View posts on public website
5. Test like/save functionality (requires user account)

## Support

For detailed documentation, see:
- `README.md` - Main project documentation
- `webapp/README.md` - Public website docs
- `client/README.md` - Admin panel docs




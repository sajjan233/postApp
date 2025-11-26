# Post App - Full Stack Application

Production-ready full-stack application with Admin Panel, Public Website, and Backend API.

## Project Structure

```
postApp/
├── client/          # Admin Panel (React)
├── server/          # Backend API (Node.js/Express)
└── webapp/          # Public Website (React)
```

## Features

### Admin Panel (client/)
- Admin login system
- CRUD operations for posts
- User list management
- Protected routes
- Real-time post updates via Socket.io

### Public Website (webapp/)
- Public post feed
- Like and save posts
- Google AdSense integration
- Real-time updates
- Responsive modern UI

### Backend (server/)
- RESTful API with Express
- JWT authentication
- Socket.io for real-time updates
- MongoDB database
- File upload support
- Production-ready configuration

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and navigate to project:**
```bash
cd postApp
```

2. **Install dependencies for each folder:**
```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Admin Panel
cd ../client
npm install

# Public Website
cd ../webapp
npm install
cp .env.example .env
```

3. **Configure environment variables:**

**server/.env:**
```env
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/postapp
JWT_SECRET=your-secret-key
JWT_EXPIRE=300d
```

**webapp/.env:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run server
```

**Terminal 2 - Admin Panel:**
```bash
cd client
npm start
```

**Terminal 3 - Public Website:**
```bash
cd webapp
npm start
```

#### Production Mode

1. **Build frontend applications:**
```bash
cd client
npm run build

cd ../webapp
npm run build
```

2. **Start backend server:**
```bash
cd server
NODE_ENV=production npm run server
```

## API Endpoints

### Public Endpoints
- `POST /api/allpost` - Get all posts (no auth required)

### Protected Endpoints (require JWT token)
- `POST /api/post/create` - Create post
- `GET /api/post/get` - Get user's posts
- `PUT /api/post/update/:id` - Update post
- `DELETE /api/post/delete/:id` - Delete post
- `POST /api/post/like/:postId` - Like/unlike post
- `POST /api/post/save/:postId` - Save/unsave post

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/me` - Get current user

## Socket.io Events

### Client → Server
- `join-public` - Join public room for real-time updates

### Server → Client
- `newPost` - New post created (broadcasted to all clients)

## Environment Variables

### Server (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `DB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | No |
| `CLIENT_URL` | Admin panel URL (production) | Production |
| `WEBAPP_URL` | Public website URL (production) | Production |

### Webapp (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | Yes |

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Start server: `NODE_ENV=production node server.js`

### Frontend Deployment

1. Build the applications:
   ```bash
   cd client && npm run build
   cd ../webapp && npm run build
   ```

2. Deploy `build` folders to static hosting:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Or serve via nginx/Apache

### Docker (Optional)

Create `Dockerfile` in each directory for containerized deployment.

## Project URLs

- **Backend API:** `http://localhost:5000`
- **Admin Panel:** `http://localhost:3000`
- **Public Website:** `http://localhost:3001` (or next available port)

## Technology Stack

- **Frontend:** React 18/19, React Router, Socket.io Client
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Styling:** CSS3 with modern design

## Development Notes

- All code includes comprehensive comments
- Reusable API functions in frontend
- Error handling and validation
- Production-ready optimizations
- Responsive design for all screen sizes

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check `DB_URI` in server `.env`
- Ensure network access if using cloud MongoDB

### CORS Errors
- Update CORS origins in `server/server.js`
- Check environment variables for production URLs

### Socket.io Connection Issues
- Verify Socket.io server is running
- Check CORS configuration
- Ensure correct `REACT_APP_SOCKET_URL` in frontend `.env`

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

## License

ISC

## Support

For issues or questions, check the individual README files in each folder:
- `client/README.md` - Admin panel documentation
- `webapp/README.md` - Public website documentation
- `server/README.md` - Backend API documentation




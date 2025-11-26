# Public Website (Webapp)

Production-ready React application for the public website. Displays posts in a feed with real-time updates, like/save functionality, and Google AdSense integration.

## Features

- 📱 **Responsive Design** - Modern, mobile-first UI
- 🔄 **Real-time Updates** - Socket.io integration for live post updates
- ❤️ **Like & Save Posts** - User interaction features (requires authentication)
- 📊 **AdSense Integration** - Ready for Google AdSense ads
- 🚀 **Production Ready** - Optimized for deployment

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see server README)

## Installation

1. Navigate to the webapp directory:
```bash
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000` (or next available port).

## Production Build

Build for production:
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
webapp/
├── public/              # Static files
├── src/
│   ├── components/     # React components
│   │   ├── PostCard.js      # Individual post card
│   │   ├── PostFeed.js     # Main feed component
│   │   └── AdSense.js      # AdSense integration
│   ├── context/        # React contexts
│   │   └── SocketContext.js # Socket.io connection
│   ├── utils/          # Utility functions
│   │   └── api.js          # API calls
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── .env.example        # Environment variables template
└── package.json        # Dependencies
```

## Google AdSense Setup

1. Get your AdSense Publisher ID from Google AdSense
2. Update `src/components/AdSense.js`:
   - Replace `ca-pub-YOUR_PUBLISHER_ID` with your actual publisher ID
   - Update the script URL in `public/index.html` if needed
3. Ads will appear after every 3rd post in the feed

## API Integration

The app uses the following API endpoints:

- `POST /api/allpost` - Get all posts (public, no auth required)
- `POST /api/post/like/:postId` - Like/unlike post (requires auth)
- `POST /api/post/save/:postId` - Save/unsave post (requires auth)

## Socket.io Events

- `newPost` - Receives new posts in real-time when admin creates them

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Static Hosting** (Netlify, Vercel, etc.)
   - Build the app: `npm run build`
   - Deploy the `build` folder

2. **Server Deployment**
   - Build the app: `npm run build`
   - Serve the `build` folder with a web server (nginx, Apache, etc.)

3. **Docker** (if configured)
   - Build and run the container

## Troubleshooting

### Socket.io Connection Issues
- Ensure backend server is running
- Check CORS configuration in server
- Verify `REACT_APP_SOCKET_URL` matches server URL

### API Errors
- Verify backend server is running
- Check `REACT_APP_API_URL` in `.env`
- Ensure backend CORS allows your frontend origin

### AdSense Not Showing
- Verify publisher ID is correct
- Check browser console for errors
- Ensure AdSense account is approved

## License

ISC

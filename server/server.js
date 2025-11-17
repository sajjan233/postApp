import http from 'http';
import { Server } from 'socket.io';
import app from "./src/app.js";
import './src/config/passport.js';

// ✅ MongoDB connection
const { PORT } = process.env;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Expose io globally so routes can use it
global.io = io;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT || 5000, () => {
  console.log(`✅ Server running on port ${PORT || 5000}`);
  console.log(`✅ Socket.io server initialized`);
});

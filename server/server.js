// server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import ApiRouter from "./src/routes/index.js";
import authRouter from "./src/routes/authRouter.js";
import path from "path";
import { fileURLToPath } from 'url';
import './src/config/passport.js';
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",   // Local dev React app
    "http://3.108.254.144:5000"   // Production domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true // Allow cookies/auth headers
};

app.use(cors(corsOptions));

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
connectDB();

// Initialize Express app

// Middleware

app.use(express.json());

// API Routes
app.use("/api", ApiRouter);
app.use("/auth", authRouter);

// Serve static files from public folder
// Serve static files



// Serve uploads correctly
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));


// Serve React build
app.use(express.static(path.join(__dirname, '../client/build')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Or your deployed React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Expose io globally
global.io = io;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.io server initialized`);
});

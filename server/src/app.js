// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ApiRouter from "./routes/index.js";
import authRouter from "./routes/authRouter.js";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });


dotenv.config();
dotenv.config();
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", ApiRouter);
app.use("/auth", authRouter);

// Serve static files from public directory
// This makes /public/uploads/file.jpg accessible
app.use('/public', express.static(path.join(__dirname, '../public')));
// Also serve uploads directly at /uploads for convenience
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../client/build')));
app.get("/", (req, res) => {
  res.send("✅ CSC Poster API is Running...");
});

export default app;

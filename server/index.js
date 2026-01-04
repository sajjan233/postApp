const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (your existing routes)
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const postRoutes = require("./routes/postRoutes");
const adminSearchRoutes = require("./routes/adminSearchRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const referralRoutes = require("./routes/referralRoutes");
const queryRoutes = require("./routes/queryRoutes");
const chatRoutes = require("./routes/chatRouter");
const {handlePrivateMessage,userchatList} = require('./controllers/chat')

app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/posts", postRoutes);
app.use("/admins", adminSearchRoutes);
app.use("/category", categoryRoutes);
app.use("/referr", referralRoutes);
app.use("/query", queryRoutes);
app.use("/chat", chatRoutes);

/* ===== MONGODB ===== */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ===== HTTP SERVER ===== */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
/* ===== SOCKET.IO ===== */
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  // User joins their own room
  socket.on("join", (userId) => {
    console.log("userId", userId);
    socket.join(userId.toString());
    console.log("👤 Joined room:", userId);
  });

  // Private message
  socket.on("privateMessage", async (data) => {

    try {
      console.log("data",data);
      
      // 1️⃣ Save the message to DB
      const savedMessage = await handlePrivateMessage(data);
      if (!savedMessage) return;

      // 2️⃣ Emit ONLY the new message to sender & receiver
      io.to(data.to.toString()).emit("receiveMessage", savedMessage);
      io.to(data.from.toString()).emit("receiveMessage", savedMessage);

    } catch (err) {
      console.error("❌ Save error:", err);
    }
  });


    socket.on("callUser", ({ from, to, signalData }) => {
      console.log("from, to, signalData ",from, to, signalData );
      
    io.to(to).emit("callIncoming", { from, signalData });
  });

  // user answers call
  socket.on("answerCall", ({ to, signalData }) => {

    console.log("{ to, signalData }",{ to, signalData })
    io.to(to).emit("callAccepted", signalData);
  });

  // ICE candidates
  socket.on("iceCandidate", ({ to, candidate }) => {
    console.log("{ to, candidate }",{ to, candidate })
    io.to(to).emit("iceCandidate", candidate);
  });
});


/* ===== START SERVER ===== */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

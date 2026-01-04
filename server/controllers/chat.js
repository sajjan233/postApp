import express from "express";
const router = express.Router();
import Chat from "../models/Chat.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId




export async function handlePrivateMessage(data) {
  const { messageId, from, to, msg } = data;

  if (!from || !to || !msg) {
    console.log("❌ Missing fields", { messageId, from, to, msg });
    return;
  }

  try {
    // Use mongoose.Types.ObjectId
    const saved = await Chat.create({
      messageId: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      from: from,
      to: to,
      msg,
    });

    console.log("💾 Saved message:", saved);
    return saved;
  } catch (err) {
    console.log("❌ Save error:", err);
  }
}

export async function userchatList(to, from) {
  let response = {
    message: '',
    status: 0
  }
  try {
console.log("to,from",to,from);

    const messages = await Chat.find({
      $or: [
        { from: from, to: to }
      ]
    }).sort({ createdAt: 1 });

    response.messages = messages
    response.status = 1

    return response;
  } catch (err) {

    response.message = err.message
    response.status = 0
    return response;

  }
}

// 🔹 Chat history API
export async function userchat(req, res) {
  let response = {
    message: '',
    status: 0
  }
  try {
       const from = req.user.id;
    const to = req.body?.to?.secondUserId; // ✅ FIX

    if (!from || !to) {
      return res.status(400).json({
        status: 0,
        message: "from or secondUserId missing",
      });
    }

    const messages = await Chat.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from },
      ],
    }).sort({ createdAt: 1 });

    response.list = messages
    response.status = 1

    return res.json(response);
  } catch (err) {
    console.log("err", err)
    response.message = err.message
    response.status = 0
    return res.json(response);

  }
}

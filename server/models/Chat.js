// models/Chat.js
const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },

  from: { type: String, required: true }, // STRING
  to: { type: String, required: true },   // STRING

    msg: {
      type: String,
      required: true,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Chat", chatSchema);
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  fcmToken: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: String, // optional (androidId)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Device", deviceSchema);

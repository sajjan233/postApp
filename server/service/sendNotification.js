const Device = require("../models/Device");
const admin = require("./firebase");

const sendPush = async (token, title, body) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (err) {
    console.error("FCM Error:", err);
  }
};




exports.sendToUser = async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    // 🔥 Get all devices of that user
    const devices = await Device.find();

    if (!devices.length) {
      return res.status(404).json({
        success: false,
        message: "No devices found"
      });
    }

    // 🔥 Extract tokens
    const tokens = devices.map(device => device.fcmToken);

    // 🔥 Send to notification function
    await sendPush(tokens, title, body);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = sendPush;

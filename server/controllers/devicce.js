const Device = require("../models/Device");

exports.saveToken = async (req, res) => {
  const { fcmToken, deviceId } = req.body;

  try {
    await Device.findOneAndUpdate(
      { fcmToken },
      { deviceId },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

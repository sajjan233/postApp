const User = require("../models/User");

exports.scanReferral = async (req, res) => {
  try {
    console.log("req.body",req.body);
    console.log("req.user",req.user);
    
    const { referralCode } = req.body;
    const currentUserId = req.user._id; // JWT se

    const scannedUser = await User.findOne({ referralCode });

    if (!scannedUser) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    // ❌ self scan block
    if (scannedUser._id.equals(currentUserId)) {
      return res.status(400).json({ message: "Cannot scan your own QR" });
    }

    const currentUser = await User.findById(currentUserId);

    // ❌ already connected
    if (currentUser.connections.includes(scannedUser._id)) {
      return res.json({ message: "Already connected" });
    }

    // ✅ add connection both sides
    currentUser.connections.push(scannedUser._id);
    scannedUser.connections.push(currentUser._id);

    await currentUser.save();
    await scannedUser.save();

    res.json({
      message: "Connected successfully",
      connectedWith: scannedUser.name
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

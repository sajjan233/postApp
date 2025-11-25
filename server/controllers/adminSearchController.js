const User = require('../models/User');

// Search Admins
exports.searchAdmins = async (req, res) => {
  try {
    const { query } = req.query;

    let admins;

    if (!query || query.trim() === '') {
      // Return all admins if no query
      admins = await User.find({ role: 'admin' })
        .select('name shopName phone pincode famousPlace adminKey _id');
    } else {
      const searchRegex = new RegExp(query, 'i');

      admins = await User.find({
        role: 'admin',
        $or: [
          { name: searchRegex },
          { shopName: searchRegex },
          { phone: searchRegex },
          { pincode: searchRegex },
          { famousPlace: searchRegex }
        ]
      }).select('name shopName phone pincode famousPlace adminKey _id');
    }

    res.json({
      admins
    });
  } catch (error) {
    console.error('Search admins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


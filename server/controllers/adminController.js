const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-here', {
    expiresIn: '300d'
  });
};

// Register Admin
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, shopName, pincode, famousPlace } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Create admin user
    const admin = new User({
      name,
      email,
      phone,
      password,
      shopName,
      pincode,
      famousPlace,
      role: 'admin'
    });

    await admin.save();

    const token = generateToken(admin._id);

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        shopName: admin.shopName,
        adminKey: admin.adminKey
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.registeruser = async (req, res) => {
  try {
    const { name, email, number, password, referralCode } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Invalid number" });
    }

    let phone = number;

    // 🔹 Check if user already exists
    let user = await User.findOne( { phone });

    let isNewUser = false;
    let referrerId = null;

    // 🔹 Find referrer if referralCode exists
    if (referralCode) {
      const refDoc = await User.findOne({ referralCode });
      referrerId = refDoc ? refDoc._id : null;
    }

    console.log("referrerId",referrerId);
    
    // 🔹 Create new user
    if (!user) {
      user = new User({
        name,
        phone,
        password,
        role: "customer",
        connections: referrerId ? [referrerId] : [] // save referrer ID if exists
      });
      await user.save();
      isNewUser = true;
    }

    // 🔹 Handle referral for existing user
    if (referrerId && !user.connections.includes(referrerId)) {
      user.connections.push(referrerId); // add referrer ID to user connections
      await user.save();
      console.log(`Referral connection added: ${user._id} → ${referrerId}`);
    }

    // 🔹 Generate JWT token
    const token = generateToken(user._id);

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "New user registered successfully" : "User already exists",
      token,
      newuser: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        connections: user.connections // optional: return connections array
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: { $in: ['admin', 'masterAdmin'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopName: user.shopName,
        adminKey: user.adminKey,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Admin by adminKey
exports.getAdminByKey = async (req, res) => {
  try {
    const { adminKey } = req.params;
    console.log("adminKey", adminKey);

    const admin = await User.findOne({ referralCode :adminKey, role: 'admin' });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        shopName: admin.shopName,
        phone: admin.phone,
        pincode: admin.pincode,
        famousPlace: admin.famousPlace,
        adminKey: admin.adminKey
      }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



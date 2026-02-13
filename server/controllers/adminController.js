const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-here', {
    expiresIn: '300d'
  });
};

function generateUniqueCode(name, phone) {
  let oddLetters = '';
  let evenNumbers = '';

  // Process name: take letters at odd ASCII codes
  for (let i = 0; i < name.length; i++) {
    const charCode = name.charCodeAt(i);
    if (charCode % 2 !== 0) {
      oddLetters += name[i];
    }
  }

  // Process phone: take even digits
  for (let digit of phone) {
    if (parseInt(digit) % 2 === 0) {
      evenNumbers += digit;
    }
  }

  // Combine: letters first, numbers last
  return oddLetters + evenNumbers;
}
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
      role: 'admin',
      notificationSubscription: {
        isActive: false,
        maxNotificationPerPostPerDay: 0,
        startDate: null,
        endDate: null
      }
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
    console.log("name, email, number,", name, email, number,);

    if (!number) {
      return res.status(400).json({ message: "Invalid number" });
    }

    let phone = number;

    // 🔹 Check if user already exists
    let user = await User.findOne({ phone });

    let isNewUser = false;
    let referrerId = null;

    // 🔹 Find referrer if referralCode exists
    if (referralCode) {
      const refDoc = await User.findOne({ referralCode });
      referrerId = refDoc ? refDoc._id : null;
    }

    console.log("referrerId", referrerId);

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
    } else {
      user.connections.push('6921c18a71c8817b35046318'); // add referrer ID to user connections
      await user.save();
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
        role: user.role,
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
    console.log("email, password", email, password);

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

    if (!user?.referralCode) {
      user.referralCode = generateUniqueCode(user.shopName ? user.shopName : user.name, user.phone)
      user.save()
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

    const admin = await User.findOne({ referralCode: adminKey, role: 'admin' });

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


exports.updateNotificationSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      isActive,
      maxNotificationPerPostPerDay,
      startDate,
      endDate
    } = req.body;

    // validation
    if (isActive && maxNotificationPerPostPerDay <= 0) {
      return res.status(400).json({
        success: false,
        message: "maxNotificationPerPostPerDay must be greater than 0"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        notificationSubscription: {
          isActive,
          maxNotificationPerPostPerDay,
          startDate,
          endDate
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification subscription updated",
      data: user.notificationSubscription
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

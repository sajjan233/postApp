import User from "./user.js";
import Role from "../role/role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ObjectId type
const ObjectId = mongoose.Types.ObjectId;




async function createUser(name, email, password, roleSlug, parentId) {
  try {

    if (!["admin", "subadmin"].includes('admin')) {
      return { message: "Unauthorized — only admin or subadmin can create users" };
    }

    const role = await Role.findOne({ slug: roleSlug });
    if (!role) return { message: "Invalid role" };

    const existingUser = await User.findOne({ email });
    console.log('existingUser', existingUser);

    if (existingUser)
      return { message: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: role._id,
      shopName: 'XYZ CSC canter',
      nearby: "A B C school",
      pinCode: 125001
    });

    return {
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: role.role,
      },
    }
  } catch (err) {
    console.error(err);
    return { message: err.message }
  }
};

//  createUser('sajjan','test@gmail.com','pass@#123',"admin",)

// Step 1: Register with mobile and email
export const registerStep1 = async (req, res) => {
  try {
    const { mobile, email, password } = req.body;

    if (!mobile || !email || !password) {
      return res.status(400).json({ message: "Mobile, email, and password are required" });
    }

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Find default role ID: "691761fafa0a93e7cb7587ce"
    const defaultRoleId = new mongoose.Types.ObjectId('691761fafa0a93e7cb7587ce');
    
    // Create user with step 1 data
    const user = await User.create({
      mobile,
      email,
      password,
      roleId: defaultRoleId,
    });

    res.status(201).json({
      message: "Step 1 completed. Please complete your profile.",
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Step 2: Complete profile
export const registerStep2 = async (req, res) => {
  try {
    const { userId, name, shopName, nearby, pinCode } = req.body;

    if (!userId || !name || !shopName || !nearby || !pinCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user profile
    user.name = name;
    user.shopName = shopName;
    user.nearby = nearby;
    user.pinCode = pinCode;
    await user.save();

    res.status(200).json({
      message: "Profile completed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        nearby: user.nearby,
        pinCode: user.pinCode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Legacy register function (for backward compatibility)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, roleSlug, parentId, mobile, shopName, nearby, pinCode } = req.body;

    // Find Role by slug or use default
    let role;
    if (roleSlug) {
      role = await Role.findOne({ slug: roleSlug });
      if (!role) return res.status(400).json({ message: "Invalid role" });
    } else {
      // Use default role ID
      role = { _id: new mongoose.Types.ObjectId('691761fafa0a93e7cb7587ce') };
    }

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      shopName,
      nearby,
      pinCode,
      roleId: role._id,
      parentId,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("roleId")
      .populate("likedPosts")
      .populate("savedPosts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      shopName: user.shopName,
      nearby: user.nearby,
      pinCode: user.pinCode,
      role: user.roleId?.role,
      likedPosts: user.likedPosts || [],
      savedPosts: user.savedPosts || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found with this email" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.status(200).json({
      message: "Reset token generated (valid for 10 minutes)",
      token: resetToken, // 🔴 Only for testing
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password; // 🧠 Will be hashed automatically
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    if (error.name === "TokenExpiredError")
      return res.status(400).json({ message: "Token expired" });
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).populate("roleId");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateJWT(user.roleId?.slug);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId?.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const centerNameList = async (req,res) => {
  let response = {
    message: "",
    status: 0
  }
  try {
    if (!req.body.pinCode) {
      response.message = 'Pin code provide'
      return res.json(response)
    }
console.log("req.body.pinCode",req.body.pinCode);

    let posts = await User.find({pinCode: req.body.pinCode , roleId : new ObjectId('6914c2a509e496f39d8d599b')},'name nearby shopName')

    console.log("posts",posts);
    
    response.message = ''
    response.status = 1
    response.list = posts

    return res.json(response)

  } catch (err) {
    console.log("err",err);
    
    response.message = err.message
    response.status = 0
    return res.json(response)
  }
}
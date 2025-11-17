import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    shopName: { type: String },
    nearby: { type: String },
    pinCode: { type: Number },
    mobile: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Boolean, default: true },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🎟️ Generate JWT
userSchema.methods.generateJWT = function (roleSlug) {
  return jwt.sign(
    { id: this._id, role: roleSlug || "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "300d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;

// ------------------ Controllers ------------------

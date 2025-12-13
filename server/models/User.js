const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.role === 'admin' || this.role === 'masterAdmin';
    }
  },
  role: {
    type: String,
    enum: ['masterAdmin', 'admin', 'customer'],
    required: true
  },
  // Admin specific fields
  shopName: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  famousPlace: {
    type: String,
    trim: true
  },
  adminKey: {
    type: String,
    unique: true,
    sparse: true
  },
  // Customer specific fields
  customerId: {
    type: String,
    unique: true,
    sparse: true
  },
  referralCode: { type: String, unique: true },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Generate adminKey for admin users
userSchema.pre('save', async function(next) {
  if (this.role === 'admin' && !this.adminKey) {
    const { v4: uuidv4 } = require('uuid');
    this.adminKey = uuidv4();
  }
  next();
});

// Generate customerId for customer users
userSchema.pre('save', async function(next) {
  if (this.role === 'customer' && !this.customerId) {
    const { v4: uuidv4 } = require('uuid');
    this.customerId = uuidv4();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);



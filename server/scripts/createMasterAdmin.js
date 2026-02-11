const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createMasterAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/postwala', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if master admin already exists
    const existingMaster = await User.findOne({ role: 'masterAdmin' });
    if (existingMaster) {
      console.log('Master admin already exists!');
      console.log('Email:', existingMaster.email);
      process.exit(0);
    }

    // Get credentials from command line or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'Master Admin';
    const email = args[1] || 'master@admin.com';
    const password = args[2] || 'admin123';

    // Create master admin
    const masterAdmin = new User({
      name,
      email,
      password,
      role: 'masterAdmin'
    });

    await masterAdmin.save();

    console.log('Master admin created successfully!');
    console.log('Name:', masterAdmin.name);
    console.log('Email:', masterAdmin.email);
    console.log('Password:', password);
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating master admin:', error);
    process.exit(1);
  }
};

createMasterAdmin();


console.log("asdf");

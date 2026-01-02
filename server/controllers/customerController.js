const User = require('../models/User');
const CustomerAdminMap = require('../models/CustomerAdminMap');
const Counter = require('../models/Counter')
// Select Admin (via QR or Search)
exports.selectAdmin = async (req, res) => {
  try {
    const { customerId, adminKey, adminId ,number} = req.body;

    let customer;
    let admin;

    // Get or create customer
    if (customerId) {
      customer = await User.findOne({ customerId, role: 'customer' });
    }

    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const userId = `user${counter.seq}`;

    if (!customer) {
      // Create new customer
      customer = new User({
        phone: number,
        role: 'customer',
        customerId: userId
      });
      await customer.save();
    }

    // Find admin by adminKey or adminId
    if (adminKey) {
      admin = await User.findOne({ adminKey, role: 'admin' });
    } else if (adminId) {
      admin = await User.findById(adminId);
    }

    if (admin || admin?.role === 'admin') {
      
      // Create or update mapping
      const mapping = await CustomerAdminMap.findOneAndUpdate(
        { customerId: customer.customerId, adminId: admin._id },
        { customerId: customer.customerId, adminId: admin._id },
        { upsert: true, new: true }
      );
    }

    res.json({
      message: 'Admin selected successfully',
      customerId: customer.customerId,
      adminId: admin?._id,
      admin: {
        id: admin?._id,
        name: admin?.name,
        shopName: admin?.shopName,
        adminKey: admin?.adminKey
      }
    });
  } catch (error) {
    console.error('Select admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.list = async (req,res) => {
  let response = {
    message : '',
    status : 0
  }
  try {
    console.log(req.user)
    let list = await User.find({ role: 'customer' ,_id : {$ne : req.user._id}});
    console.log("list",list);
    
    response.message = ''
    response.status = 1
    response.list = list
    return res.json(response)
  } catch (err) {
    response.status = 0
    response.message = err.message
    return res.json(response)
  }
}
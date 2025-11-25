const mongoose = require('mongoose');

const customerAdminMapSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  selectedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
customerAdminMapSchema.index({ customerId: 1, adminId: 1 }, { unique: true });

module.exports = mongoose.model('CustomerAdminMap', customerAdminMapSchema);



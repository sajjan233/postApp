const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  postId: {
    type: String
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 3;
      },
      message: 'Maximum 3 images allowed'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  viewsCount: { type: Number, default: 0 },

maxAllowed: {
    type: Number,
    required: true
  },

  sentCount: {
    type: Number,
    default: 0
  },

  startTime: {
    type: Date,
    required: true
  },

  expireTime: {
    type: Date,
    required: true
  },

  lastSentAt: {
    type: Date,
    default: null
  },

  isCompleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ adminId: 1, createdAt: -1 });

// Auto-generate postId and slug before saving
postSchema.pre('save', function (next) {
  if (!this.postId) {
    this.postId = `POST-${Date.now()}`;
  }
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);

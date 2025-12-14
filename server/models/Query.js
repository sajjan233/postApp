const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    user: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["pending", "replied", "closed"],
      default: "pending"
    },

    adminReply: {
      type: String,
      default: ""
    },

    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);

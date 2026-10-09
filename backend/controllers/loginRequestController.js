
const mongoose = require("mongoose");

const loginRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    method: {
      type: String,
      enum: ["Email", "Google"],
      default: "Email",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
      required: true,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginRequest", loginRequestSchema);

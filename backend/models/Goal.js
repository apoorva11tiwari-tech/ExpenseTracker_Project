
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    // Firebase UID of the user who owns this goal
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    targetDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Goal || mongoose.model("Goal", goalSchema);


const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Each user can have only one budget per category.
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports =
  mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// @desc    Get all budgets with calculated spent amounts
// @route   GET /api/budgets
// @access  Public
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    const expenses = await Expense.find();

    // Aggregate spending per category (case-insensitive)
    const categoryExpenses = {};
    expenses.forEach((item) => {
      if (item.category) {
        const cat = item.category.trim().toLowerCase();
        categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(item.amount || 0);
      }
    });

    // Merge spent amounts with target budgets
    const budgetSummary = budgets.map((b) => {
      const catKey = b.category.trim().toLowerCase();
      const spent = categoryExpenses[catKey] || 0;
      
      return {
        _id: b._id,
        category: b.category,
        budgetedAmount: b.amount,
        spentAmount: spent,
        remainingAmount: Math.max(0, b.amount - spent),
        percentageSpent: b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0,
      };
    });

    res.status(200).json(budgetSummary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error: error.message });
  }
};

// @desc    Add or Update budget for a category
// @route   POST /api/budgets
// @access  Public
const addOrUpdateBudget = async (req, res) => {
  const { category, amount } = req.body;

  if (!category || amount === undefined) {
    return res.status(400).json({ message: "Category and amount are required" });
  }

  try {
    const trimmedCategory = category.trim();

    // Upsert budget using case-insensitive search
    const budget = await Budget.findOneAndUpdate(
      { category: { $regex: new RegExp(`^${trimmedCategory}$`, "i") } },
      { category: trimmedCategory, amount: Number(amount) },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Budget saved successfully", budget });
  } catch (error) {
    res.status(500).json({ message: "Error saving budget", error: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Public
const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
};

module.exports = {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
};
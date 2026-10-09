
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Get budgets with spending calculated for the logged-in user
const getBudgets = async (req, res) => {
  try {
    const userId = req.user.uid;

    const budgets = await Budget.find({ userId });
    const expenses = await Expense.find({ userId });

    // Calculate spending per category, ignoring letter case
    const categoryExpenses = {};

    expenses.forEach((item) => {
      if (item.category) {
        const category = item.category.trim().toLowerCase();

        categoryExpenses[category] =
          (categoryExpenses[category] || 0) +
          Number(item.amount || 0);
      }
    });

    // Combine the user's budgets with their spending
    const budgetSummary = budgets.map((budget) => {
      const categoryKey = budget.category.trim().toLowerCase();
      const spent = categoryExpenses[categoryKey] || 0;

      return {
        _id: budget._id,
        category: budget.category,
        budgetedAmount: budget.amount,
        spentAmount: spent,
        remainingAmount: Math.max(0, budget.amount - spent),
        percentageSpent:
          budget.amount > 0
            ? Math.round((spent / budget.amount) * 100)
            : 0,
      };
    });

    return res.status(200).json(budgetSummary);
  } catch (error) {
    console.error("Fetch budgets error:", error);

    return res.status(500).json({
      message: "Error fetching budgets",
      error: error.message,
    });
  }
};


// Add or update a budget for the logged-in user
const addOrUpdateBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const userId = req.user.uid;

    if (
      typeof category !== "string" ||
      !category.trim() ||
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0
    ) {
      return res.status(400).json({
        message: "A valid category and non-negative amount are required",
      });
    }

    const trimmedCategory = category.trim();

    // Escape special regex characters in the category name
    const escapedCategory = trimmedCategory.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    // Find a matching category only within this user's budgets
    const budget = await Budget.findOneAndUpdate(
      {
        userId,
        category: {
          $regex: new RegExp(`^${escapedCategory}$`, "i"),
        },
      },
      {
        $set: {
          category: trimmedCategory,
          amount: Number(amount),
          userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error("Save budget error:", error);

    return res.status(500).json({
      message: "Error saving budget",
      error: error.message,
    });
  }
};


// Delete only a budget owned by the logged-in user
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    return res.status(500).json({
      message: "Error deleting budget",
      error: error.message,
    });
  }
};


module.exports = {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
};

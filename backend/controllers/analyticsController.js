const Expense = require("../models/Expense");
const Income = require("../models/Income");

// @desc    Get aggregated financial analytics data
// @route   GET /api/analytics
// @access  Public
const getAnalyticsSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const incomes = await Income.find();

    // 1. Calculate Totals
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const netSavings = totalIncome - totalExpense;

    // 2. Aggregate Expenses by Category
    const categoryTotals = {};
    expenses.forEach((item) => {
      const category = item.category || "Uncategorized";
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(item.amount || 0);
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
      percentage: totalExpense > 0 ? ((categoryTotals[category] / totalExpense) * 100).toFixed(1) : 0
    }));

    // 3. Aggregate Incomes by Source
    const sourceTotals = {};
    incomes.forEach((item) => {
      const source = item.source || "Other";
      sourceTotals[source] = (sourceTotals[source] || 0) + Number(item.amount || 0);
    });

    const sourceBreakdown = Object.keys(sourceTotals).map((source) => ({
      name: source,
      value: sourceTotals[source]
    }));

    res.status(200).json({
      summary: {
        totalIncome,
        totalExpense,
        netSavings
      },
      categoryBreakdown,
      sourceBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics data", error: error.message });
  }
};

module.exports = {
  getAnalyticsSummary
};

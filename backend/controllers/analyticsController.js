const Expense = require("../models/Expense");
const Income = require("../models/Income");

// @desc    Get aggregated financial analytics data
// @route   GET /api/analytics?period=daily
// @access  Public
const getAnalyticsSummary = async (req, res) => {
  try {
    const period = (req.query.period || "monthly").toLowerCase();

    const now = new Date();

    // Start and end date according to selected period
    let startDate;
    let endDate;

    if (period === "daily") {
      // Today
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "weekly") {
      // Current week: Monday to Sunday
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      const day = startDate.getDay();
      const difference = day === 0 ? 6 : day - 1;

      startDate.setDate(startDate.getDate() - difference);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "yearly") {
      // Current year
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Monthly - current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Get all records
    const allExpenses = await Expense.find();
    const allIncomes = await Income.find();

    // Filter expenses according to selected period
    const expenses = allExpenses.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt);

      return itemDate >= startDate && itemDate <= endDate;
    });

    // Filter income according to selected period
    const incomes = allIncomes.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt);

      return itemDate >= startDate && itemDate <= endDate;
    });

    // Calculate total expense
    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    // Calculate total income
    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    // Calculate net savings
    const netSavings = totalIncome - totalExpense;

    // Aggregate expenses by category
    const categoryTotals = {};

    expenses.forEach((item) => {
      const category = item.category || "Uncategorized";

      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(item.amount || 0);
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
      percentage:
        totalExpense > 0
          ? ((categoryTotals[category] / totalExpense) * 100).toFixed(1)
          : 0,
    }));

    // Aggregate income by source
    const sourceTotals = {};

    incomes.forEach((item) => {
      const source = item.source || "Other";

      sourceTotals[source] =
        (sourceTotals[source] || 0) + Number(item.amount || 0);
    });

    const sourceBreakdown = Object.keys(sourceTotals).map((source) => ({
      name: source,
      value: sourceTotals[source],
    }));

    res.status(200).json({
      period,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalIncome,
        totalExpense,
        netSavings,
      },
      categoryBreakdown,
      sourceBreakdown,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalyticsSummary,
};
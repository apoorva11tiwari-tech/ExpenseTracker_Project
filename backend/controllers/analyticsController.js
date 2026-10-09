
const Expense = require("../models/Expense");
const Income = require("../models/Income");

// @desc    Get aggregated financial analytics for the logged-in user
// @route   GET /api/analytics?period=daily
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  try {
    // Firebase authentication middleware attaches the user to req
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const allowedPeriods = ["daily", "weekly", "monthly", "yearly"];
    const requestedPeriod = String(
      req.query.period || "monthly"
    ).toLowerCase();

    const period = allowedPeriods.includes(requestedPeriod)
      ? requestedPeriod
      : "monthly";

    const now = new Date();
    let startDate;
    let endDate;

    // Calculate the selected period's date range
    if (period === "daily") {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "weekly") {
      // Monday to Sunday
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      const day = startDate.getDay();
      const difference = day === 0 ? 6 : day - 1;

      startDate.setDate(startDate.getDate() - difference);

      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Fetch only this user's records within the selected date range
    const dateFilter = {
      $gte: startDate,
      $lte: endDate,
    };

    const [expenses, incomes] = await Promise.all([
      Expense.find({
        userId,
        date: dateFilter,
      }).lean(),

      Income.find({
        userId,
        date: dateFilter,
      }).lean(),
    ]);

    // Calculate total expenses
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

    // Group expenses by category
    const categoryTotals = {};

    expenses.forEach((item) => {
      const category = item.category || "Uncategorized";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(item.amount || 0);
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        name: category,
        value: amount,
        percentage:
          totalExpense > 0
            ? Number(((amount / totalExpense) * 100).toFixed(1))
            : 0,
      })
    );

    // Group income by source
    const sourceTotals = {};

    incomes.forEach((item) => {
      const source = item.source || "Other";

      sourceTotals[source] =
        (sourceTotals[source] || 0) +
        Number(item.amount || 0);
    });

    const sourceBreakdown = Object.entries(sourceTotals).map(
      ([source, amount]) => ({
        name: source,
        value: amount,
      })
    );

    return res.status(200).json({
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
    console.error("Analytics error:", error.message);

    return res.status(500).json({
      message: "Error fetching analytics data.",
    });
  }
};

module.exports = {
  getAnalyticsSummary,
};

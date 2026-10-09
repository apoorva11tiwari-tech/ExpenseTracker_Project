
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Goal = require("../models/Goal");

// @desc    Get AI Financial Insights
// @route   GET /api/ai/insights
// @access  Private
const getAiInsights = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Fetch only the logged-in user's financial records
    const [expenses, incomes] = await Promise.all([
      Expense.find({ userId }),
      Income.find({ userId }),
    ]);

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const savings = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    const insights = [];

    if (totalIncome === 0) {
      insights.push({
        type: "warning",
        title: "No Income Set",
        message:
          "Please add income records in Settings or Income Tracker to get accurate financial insights.",
      });
    } else if (savingsRate > 50) {
      insights.push({
        type: "success",
        title: "Excellent Saving Habit!",
        message: `You are saving ${savingsRate.toFixed(
          1
        )}% of your income. Keep up the fantastic budgeting!`,
      });
    } else if (savingsRate > 20) {
      insights.push({
        type: "info",
        title: "Healthy Balance",
        message: `Your savings rate is ${savingsRate.toFixed(
          1
        )}%. You are maintaining a stable financial buffer.`,
      });
    } else {
      insights.push({
        type: "danger",
        title: "High Spending Alert",
        message:
          "Your expenses are closely matching or exceeding your income. Consider reviewing non-essential categories.",
      });
    }

    // Calculate expenses by category
    const categoryMap = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Uncategorized";

      categoryMap[category] =
        (categoryMap[category] || 0) +
        Number(expense.amount || 0);
    });

    for (const [category, amount] of Object.entries(categoryMap)) {
      if (totalIncome > 0 && amount / totalIncome > 0.4) {
        insights.push({
          type: "warning",
          title: `High ${category} Expenses`,
          message: `You are spending over 40% of your income on ${category}. Try cutting back here to boost savings.`,
        });
      }
    }

    res.status(200).json({
      totalIncome,
      totalExpense,
      savings,
      savingsRate: savingsRate.toFixed(1),
      insights,
    });
  } catch (error) {
    console.error("AI insights error:", error);

    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
};

// @desc    Get Budget Recommendations
// @route   POST /api/ai/recommendations
// @access  Private
const getBudgetRecommendations = async (req, res) => {
  try {
    const monthlyIncome = Number(req.body.monthlyIncome);

    if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) {
      return res.status(400).json({
        message: "Please provide a valid monthly income.",
      });
    }

    const recommendations = [
      {
        cat: "Food & Groceries",
        suggestedBudget: Math.round(monthlyIncome * 0.2),
      },
      {
        cat: "Utilities & Bills",
        suggestedBudget: Math.round(monthlyIncome * 0.15),
      },
      {
        cat: "Entertainment",
        suggestedBudget: Math.round(monthlyIncome * 0.1),
      },
      {
        cat: "Savings & Investments",
        suggestedBudget: Math.round(monthlyIncome * 0.3),
      },
    ];

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Budget recommendations error:", error);

    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
};

// @desc    Automatically allocate savings to the user's active goals
// @route   POST /api/ai/allocate
// @access  Private
const allocateSavingsWithAI = async (req, res) => {
  try {
    const userId = req.user.uid;
    const pool = Number(req.body.availableSavings);

    if (!Number.isFinite(pool) || pool <= 0) {
      return res.status(400).json({
        message:
          "Please provide a valid savings amount to allocate.",
      });
    }

    // IMPORTANT: Only load goals belonging to this user.
    const goals = await Goal.find({ userId });

    const activeGoals = goals.filter(
      (goal) =>
        Number(goal.savedAmount || 0) <
        Number(goal.targetAmount || 0)
    );

    if (activeGoals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All goals are already 100% achieved!",
        allocations: [],
        unallocatedRemainder: pool,
      });
    }

    // Calculate allocation weights
    const now = Date.now();

    const scoredGoals = activeGoals.map((goal) => {
      const remainingNeeded =
        Number(goal.targetAmount) -
        Number(goal.savedAmount || 0);

      const priorityWeight =
        goal.priority === "High"
          ? 3
          : goal.priority === "Medium"
          ? 2
          : 1;

      let urgencyWeight = 1;

      if (goal.targetDate) {
        const daysLeft = Math.max(
          1,
          (new Date(goal.targetDate).getTime() - now) /
            (1000 * 60 * 60 * 24)
        );

        urgencyWeight = 1 / Math.log(daysLeft + 1);
      }

      return {
        goal,
        remainingNeeded,
        weight: priorityWeight * urgencyWeight,
      };
    });

    const totalWeight = scoredGoals.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
      return res.status(400).json({
        message: "Unable to calculate goal allocations.",
      });
    }

    let remainingPool = pool;
    const allocations = [];

    // Process goals sequentially so remainingPool is updated safely.
    for (const item of scoredGoals) {
      if (remainingPool <= 0) break;

      const { goal, remainingNeeded, weight } = item;

      const proportionalAmount = Math.round(
        (weight / totalWeight) * pool
      );

      const allocatedAmount = Math.min(
        proportionalAmount,
        remainingNeeded,
        remainingPool
      );

      if (allocatedAmount <= 0) continue;

      // Check ownership again before updating the goal.
      const updatedGoal = await Goal.findOneAndUpdate(
        {
          _id: goal._id,
          userId,
          $expr: {
            $lt: ["$savedAmount", "$targetAmount"],
          },
        },
        {
          $inc: {
            savedAmount: allocatedAmount,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedGoal) continue;

      remainingPool -= allocatedAmount;

      allocations.push({
        goalId: updatedGoal._id,
        title: updatedGoal.title,
        addedAmount: allocatedAmount,
        newSavedAmount: updatedGoal.savedAmount,
      });
    }

    res.status(200).json({
      success: true,
      allocations,
      unallocatedRemainder: remainingPool,
    });
  } catch (error) {
    // Keep the detailed error in the backend terminal for debugging.
    console.error("AI allocation error:", error);

    res.status(500).json({
      message: "Failed to run AI Allocation",
    });
  }
};

module.exports = {
  getAiInsights,
  getBudgetRecommendations,
  allocateSavingsWithAI,
};

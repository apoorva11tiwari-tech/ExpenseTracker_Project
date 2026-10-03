const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Goal = require("../models/Goal");

// @desc    Get AI Financial Insights
const getAiInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    const incomes = await Income.find({});

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    let insights = [];

    if (totalIncome === 0) {
      insights.push({
        type: "warning",
        title: "No Income Set",
        message: "Please set your monthly income in Settings or Income Tracker to get accurate financial health scores."
      });
    } else {
      if (savingsRate > 50) {
        insights.push({
          type: "success",
          title: "Excellent Saving Habit!",
          message: `You are saving ${savingsRate.toFixed(1)}% of your income. Keep up the fantastic budgeting!`
        });
      } else if (savingsRate > 20) {
        insights.push({
          type: "info",
          title: "Healthy Balance",
          message: `Your savings rate is at ${savingsRate.toFixed(1)}%. You are maintaining a stable financial buffer.`
        });
      } else {
        insights.push({
          type: "danger",
          title: "High Spending Alert",
          message: "Your expenses are closely matching or exceeding your income. Consider reviewing non-essential categories."
        });
      }
    }

    const categoryMap = {};
    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
    });

    for (const [category, amount] of Object.entries(categoryMap)) {
      if (totalIncome > 0 && amount / totalIncome > 0.4) {
        insights.push({
          type: "warning",
          title: `High ${category} Expenses`,
          message: `You are spending over 40% of your income on ${category}. Try cutting back here to boost savings.`
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        title: "Getting Started",
        message: "Add more expenses and income records to receive detailed AI-powered insights."
      });
    }

    res.status(200).json({
      totalIncome,
      totalExpense,
      savings,
      savingsRate: savingsRate.toFixed(1),
      insights
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate AI insights", error: error.message });
  }
};

// @desc    Get Budget Recommendations
const getBudgetRecommendations = async (req, res) => {
  try {
    const { monthlyIncome } = req.body;
    const income = Number(monthlyIncome) || 50000;

    const recommendations = [
      { cat: "Food & Groceries", suggestedBudget: Math.round(income * 0.2) },
      { cat: "Utilities & Bills", suggestedBudget: Math.round(income * 0.15) },
      { cat: "Entertainment", suggestedBudget: Math.round(income * 0.1) },
      { cat: "Savings & Investments", suggestedBudget: Math.round(income * 0.3) }
    ];

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

// @desc    Automatically allocate savings to active goals using weighted AI calculations
const allocateSavingsWithAI = async (req, res) => {
  try {
    const { availableSavings } = req.body;
    const pool = Number(availableSavings);

    if (!pool || pool <= 0) {
      return res.status(400).json({ message: "Please provide a valid savings amount to allocate." });
    }

    const goals = await Goal.find();
    const activeGoals = goals.filter((g) => g.savedAmount < g.targetAmount);

    if (activeGoals.length === 0) {
      return res.status(200).json({ success: true, message: "All goals are already 100% achieved!", allocations: [] });
    }

    let totalWeight = 0;
    const scoredGoals = activeGoals.map((goal) => {
      const remainingNeeded = goal.targetAmount - goal.savedAmount;

      const priorityWeight = goal.priority === "High" ? 3 : goal.priority === "Medium" ? 2 : 1;

      let urgencyWeight = 1;
      if (goal.targetDate) {
        const daysLeft = Math.max(1, (new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        urgencyWeight = 1 / Math.log(daysLeft + 1);
      }

      const weight = priorityWeight * urgencyWeight;
      totalWeight += weight;

      return { goal, remainingNeeded, weight };
    });

    let remainingPool = pool;
    const updatePromises = scoredGoals.map(async ({ goal, remainingNeeded, weight }) => {
      let allocatedAmount = Math.round((weight / totalWeight) * pool);
      allocatedAmount = Math.min(allocatedAmount, remainingNeeded, remainingPool);

      if (allocatedAmount > 0) {
        remainingPool -= allocatedAmount;
        goal.savedAmount += allocatedAmount;
        await goal.save();
      }

      return {
        goalId: goal._id,
        title: goal.title,
        addedAmount: allocatedAmount,
        newSavedAmount: goal.savedAmount
      };
    });

    const allocations = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      allocations,
      unallocatedRemainder: remainingPool
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to run AI Allocation", error: error.message });
  }
};

module.exports = {
  getAiInsights,
  getBudgetRecommendations,
  allocateSavingsWithAI
};
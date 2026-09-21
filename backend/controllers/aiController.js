// @desc    Generate AI budget recommendations based on income & goal
// @route   POST /api/ai/budget-recommendations
// @access  Public
const getAIBudgetRecommendations = async (req, res) => {
  try {
    const { monthlyIncome, financialGoal } = req.body;
    const income = Number(monthlyIncome) || 0;

    if (income <= 0) {
      return res.status(400).json({ message: "Invalid monthly income" });
    }

    // Allocation percentages based on Financial Goal
    let Ratios = {
      Food: 0.20,
      Shopping: 0.10,
      Transport: 0.10,
      Bills: 0.25,
      Entertainment: 0.05,
      Health: 0.05,
      Education: 0.05,
      Savings: 0.20
    };

    if (financialGoal === "Save More Money") {
      Ratios = { Food: 0.15, Shopping: 0.05, Transport: 0.10, Bills: 0.20, Entertainment: 0.05, Health: 0.05, Education: 0.05, Savings: 0.35 };
    } else if (financialGoal === "Student Budget") {
      Ratios = { Food: 0.25, Shopping: 0.05, Transport: 0.15, Bills: 0.15, Entertainment: 0.05, Health: 0.05, Education: 0.20, Savings: 0.10 };
    } else if (financialGoal === "Aggressive Debt Payoff") {
      Ratios = { Food: 0.15, Shopping: 0.05, Transport: 0.10, Bills: 0.35, Entertainment: 0.05, Health: 0.05, Education: 0.05, Savings: 0.20 };
    }

    const recommendations = Object.keys(Ratios).map((cat) => ({
      cat: cat,
      suggestedBudget: Math.round(income * Ratios[cat]),
    }));

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Error generating recommendations", error: error.message });
  }
};

module.exports = {
  getAIBudgetRecommendations,
};
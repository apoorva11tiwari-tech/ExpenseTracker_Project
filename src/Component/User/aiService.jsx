// aiService.js

export async function getAIBudgetRecommendations(income, goal, currentBudgets = []) {
  const numericIncome = Number(income);

  if (!numericIncome || numericIncome <= 0) return null;

  // Base Multipliers (default: Balanced Spending)
  let multipliers = {
    Food: 0.20,
    Shopping: 0.10,
    Transport: 0.08,
    Bills: 0.22,
    Entertainment: 0.05,
    Health: 0.08,
    Education: 0.07,
    Savings: 0.20,
  };

  if (goal === "Save More Money") {
    multipliers = {
      Food: 0.18,
      Shopping: 0.05,
      Transport: 0.07,
      Bills: 0.20,
      Entertainment: 0.05,
      Health: 0.08,
      Education: 0.07,
      Savings: 0.30,
    };
  } else if (goal === "Aggressive Debt Payoff") {
    multipliers = {
      Food: 0.18,
      Shopping: 0.04,
      Transport: 0.08,
      Bills: 0.35,
      Entertainment: 0.05,
      Health: 0.08,
      Education: 0.07,
      Savings: 0.15,
    };
  } else if (goal === "Student Budget") {
    multipliers = {
      Food: 0.25,
      Shopping: 0.08,
      Transport: 0.10,
      Bills: 0.15,
      Entertainment: 0.07,
      Health: 0.05,
      Education: 0.20,
      Savings: 0.10,
    };
  }

  // Simulate AI delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Fallback category list if currentBudgets is empty
  const categoriesToProcess =
    currentBudgets.length > 0
      ? currentBudgets
      : Object.keys(multipliers).map((cat) => ({ cat }));

  return categoriesToProcess.map((item) => {
    const categoryName = item.cat || item.category;
    const ratio = multipliers[categoryName] || 0.10;
    const calculatedBudget = Math.round(numericIncome * ratio);

    return {
      cat: categoryName,
      suggestedBudget: Math.max(calculatedBudget, 500), // Ensures minimum floor of ₹500 per category
    };
  });
}
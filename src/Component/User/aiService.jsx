// aiService.js

export async function getAIBudgetRecommendations(income, goal, currentBudgets) {
  const numericIncome = Number(income);

  // Define multipliers that total 100% (1.0)
  let multipliers = {
    Food: 0.20,          // 20%
    Shopping: 0.10,      // 10%
    Transport: 0.08,     // 8%
    Bills: 0.22,         // 22%
    Entertainment: 0.05, // 5%
    Health: 0.08,        // 8%
    Education: 0.07,     // 7%
    Savings: 0.20,       // 20% (Savings & Investments)
  };

  if (goal === "Save More Money") {
    multipliers = {
      Food: 0.18,        // 18%
      Shopping: 0.05,    // 5%
      Transport: 0.07,    // 7%
      Bills: 0.20,       // 20%
      Entertainment: 0.05, // 5%
      Health: 0.08,      // 8%
      Education: 0.07,   // 7%
      Savings: 0.30,     // 30% Extra Savings!
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

  return currentBudgets.map((item) => {
    const ratio = multipliers[item.cat] || 0.10;
    const suggested = Math.round((numericIncome * ratio) / 100) * 100;
    return {
      cat: item.cat,
      suggestedBudget: Math.max(suggested, 1000),
    };
  });
}
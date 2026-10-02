const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getAiInsights = async (req, res) => {
    try {
        // Fetch all expenses and incomes from the database
        const expenses = await Expense.find({});
        const incomes = await Income.find({});

        const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
        
        const savings = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

        let insights = [];

        // Generate dynamic rules-based financial insights
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

        // Check for category heavy spending
        const categoryMap = {};
        expenses.forEach(exp => {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
        });

        for (const [category, amount] of Object.entries(categoryMap)) {
            if (totalIncome > 0 && (amount / totalIncome) > 0.4) {
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

// ADD THIS NEW FUNCTION BELOW:
const getBudgetRecommendations = async (req, res) => {
    try {
        const { monthlyIncome } = req.body;
        const income = Number(monthlyIncome) || 50000;

        const recommendations = [
            { cat: "Food & Groceries", suggestedBudget: Math.round(income * 0.20) },
            { cat: "Utilities & Bills", suggestedBudget: Math.round(income * 0.15) },
            { cat: "Entertainment", suggestedBudget: Math.round(income * 0.10) },
            { cat: "Savings & Investments", suggestedBudget: Math.round(income * 0.30) }
        ];

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
};

// Export BOTH functions here:
module.exports = { 
    getAiInsights, 
    getBudgetRecommendations 
};
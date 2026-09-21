const Expense = require("../models/Expense");

// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date,paymentMethod, description } = req.body;

        const expense = new Expense({
            title,
            amount,
            category,
            date,
            paymentMethod,
            description
        });

        const savedExpense = await expense.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense: savedExpense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add expense",
            error: error.message
        });
    }
};


// Get all expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });

        res.status(200).json(expenses);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expenses",
            error: error.message
        });
    }
};


// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update expense",
            error: error.message
        });
    }
};


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};
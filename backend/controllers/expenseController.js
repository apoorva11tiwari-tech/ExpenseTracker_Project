
const Expense = require("../models/Expense");

// Add a new expense for the logged-in user
const addExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            paymentMethod,
            description
        } = req.body;

        const expense = new Expense({
            title,
            amount,
            category,
            date,
            paymentMethod,
            description,
            userId: req.user.uid
        });

        const savedExpense = await expense.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense: savedExpense
        });
    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Failed to add expense",
            error: error.message
        });
    }
};


// Get only the logged-in user's expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user.uid
        }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Fetch expenses error:", error);

        res.status(500).json({
            message: "Failed to fetch expenses",
            error: error.message
        });
    }
};


// Delete only an expense owned by the logged-in user
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.uid
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Delete expense error:", error);

        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });
    }
};


// Update only an expense owned by the logged-in user
const updateExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            paymentMethod,
            description
        } = req.body;

        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.uid
            },
            {
                $set: {
                    title,
                    amount,
                    category,
                    date,
                    paymentMethod,
                    description
                }
            },
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
        console.error("Update expense error:", error);

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

const Income = require("../models/Income");

// Add a new income
const addIncome = async (req, res) => {
    try {
        const { title, amount, source, date, description } = req.body;

        const income = new Income({
            title,
            amount,
            source,
            date,
            description
        });

        const savedIncome = await income.save();

        res.status(201).json({
            message: "Income added successfully",
            income: savedIncome
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add income",
            error: error.message
        });
    }
};

// Get all incomes
const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch incomes",
            error: error.message
        });
    }
};

// Delete an income
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);

        if (!income) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.status(200).json({
            message: "Income deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete income",
            error: error.message
        });
    }
};

// Update an income
const updateIncome = async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.status(200).json({
            message: "Income updated successfully",
            income: updatedIncome
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update income",
            error: error.message
        });
    }
};

module.exports = {
    addIncome,
    getIncomes,
    deleteIncome,
    updateIncome
};
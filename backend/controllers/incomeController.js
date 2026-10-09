
const mongoose = require("mongoose");
const Income = require("../models/Income");

// Add a new income or update the logged-in user's monthly salary.
const addIncome = async (req, res) => {
  try {
    const { title, amount, source, date, description } = req.body;
    const userId = req.user.uid;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0
    ) {
      return res.status(400).json({
        message: "A valid title and non-negative amount are required.",
      });
    }

    const normalizedTitle = title.trim();

    // Update the salary only if it belongs to this user.
    if (
      normalizedTitle === "Monthly Salary" ||
      normalizedTitle === "Monthly Salary / Baseline"
    ) {
      const existingIncome = await Income.findOne({
        userId,
        title: {
          $in: [
            "Monthly Salary",
            "Monthly Salary / Baseline",
          ],
        },
      });

      if (existingIncome) {
        existingIncome.amount = Number(amount);
        existingIncome.title = "Monthly Salary";

        if (source !== undefined) {
          existingIncome.source = source;
        }

        if (date) {
          existingIncome.date = date;
        }

        if (description !== undefined) {
          existingIncome.description = description;
        }

        const updatedIncome = await existingIncome.save();

        return res.status(200).json({
          message: "Monthly income updated successfully.",
          income: updatedIncome,
        });
      }
    }

    const income = new Income({
      userId,
      title: normalizedTitle,
      amount: Number(amount),
      source,
      date,
      description,
    });

    const savedIncome = await income.save();

    return res.status(201).json({
      message: "Income added successfully.",
      income: savedIncome,
    });
  } catch (error) {
    console.error("Add income error:", error);

    return res.status(500).json({
      message: "Failed to add income.",
    });
  }
};

// Get only the authenticated user's incomes.
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({
      userId: req.user.uid,
    }).sort({ date: -1 });

    return res.status(200).json(incomes);
  } catch (error) {
    console.error("Fetch incomes error:", error);

    return res.status(500).json({
      message: "Failed to fetch incomes.",
    });
  }
};

// Delete only an income owned by the authenticated user.
const deleteIncome = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid income ID.",
      });
    }

    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found.",
      });
    }

    return res.status(200).json({
      message: "Income deleted successfully.",
    });
  } catch (error) {
    console.error("Delete income error:", error);

    return res.status(500).json({
      message: "Failed to delete income.",
    });
  }
};

// Update only an income owned by the authenticated user.
const updateIncome = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid income ID.",
      });
    }

    const { title, amount, source, date, description } = req.body;

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "A valid income title is required.",
        });
      }

      updates.title = title.trim();
    }

    if (amount !== undefined) {
      if (
        amount === null ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) < 0
      ) {
        return res.status(400).json({
          message: "Amount must be a non-negative number.",
        });
      }

      updates.amount = Number(amount);
    }

    if (source !== undefined) updates.source = source;
    if (date !== undefined) updates.date = date;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update.",
      });
    }

    const updatedIncome = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.uid,
      },
      {
        $set: updates,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedIncome) {
      return res.status(404).json({
        message: "Income not found.",
      });
    }

    return res.status(200).json({
      message: "Income updated successfully.",
      income: updatedIncome,
    });
  } catch (error) {
    console.error("Update income error:", error);

    return res.status(500).json({
      message: "Failed to update income.",
    });
  }
};

module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
};

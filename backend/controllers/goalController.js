
const mongoose = require("mongoose");
const Goal = require("../models/Goal");

// @desc    Get savings goals for the logged-in user
// @route   GET /api/goals
const getGoals = async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const goals = await Goal.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error.message);

    return res.status(500).json({
      message: "Error fetching goals.",
    });
  }
};

// @desc    Create a new goal for the logged-in user
// @route   POST /api/goals
const createGoal = async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const {
      title,
      targetAmount,
      savedAmount,
      category,
      priority,
      targetDate,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      targetAmount === undefined ||
      targetAmount === null ||
      targetAmount === ""
    ) {
      return res.status(400).json({
        message: "Title and target amount are required.",
      });
    }

    const target = Number(targetAmount);
    const saved = savedAmount === undefined ? 0 : Number(savedAmount);

    if (
      !Number.isFinite(target) ||
      target <= 0 ||
      !Number.isFinite(saved) ||
      saved < 0
    ) {
      return res.status(400).json({
        message: "Please enter valid goal amounts.",
      });
    }

    const goal = await Goal.create({
      userId,
      title: title.trim(),
      targetAmount: target,
      savedAmount: saved,
      category: category || "General",
      priority: priority || "Medium",
      targetDate: targetDate || null,
    });

    return res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating goal:", error.message);

    return res.status(500).json({
      message: "Error creating goal.",
    });
  }
};

// @desc    Update a goal or add funds, only if it belongs to the user
// @route   PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid goal ID.",
      });
    }

    const {
      title,
      targetAmount,
      savedAmount,
      addAmount,
      category,
      priority,
      targetDate,
    } = req.body;

    // Ownership is checked in the database query itself
    const goal = await Goal.findOne({
      _id: id,
      userId,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Goal title cannot be empty.",
        });
      }

      goal.title = title.trim();
    }

    if (targetAmount !== undefined) {
      const target = Number(targetAmount);

      if (!Number.isFinite(target) || target <= 0) {
        return res.status(400).json({
          message: "Target amount must be greater than zero.",
        });
      }

      goal.targetAmount = target;
    }

    if (category !== undefined) {
      goal.category = category;
    }

    if (priority !== undefined) {
      goal.priority = priority;
    }

    if (targetDate !== undefined) {
      goal.targetDate = targetDate || null;
    }

    if (addAmount !== undefined) {
      const addition = Number(addAmount);

      if (!Number.isFinite(addition) || addition < 0) {
        return res.status(400).json({
          message: "Amount to add must be zero or greater.",
        });
      }

      goal.savedAmount =
        Number(goal.savedAmount || 0) + addition;
    } else if (savedAmount !== undefined) {
      const saved = Number(savedAmount);

      if (!Number.isFinite(saved) || saved < 0) {
        return res.status(400).json({
          message: "Saved amount must be zero or greater.",
        });
      }

      goal.savedAmount = saved;
    }

    const updatedGoal = await goal.save();

    return res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error.message);

    return res.status(500).json({
      message: "Error updating goal.",
    });
  }
};

// @desc    Delete a goal belonging to the logged-in user
// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid goal ID.",
      });
    }

    const deletedGoal = await Goal.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    return res.status(200).json({
      message: "Goal deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting goal:", error.message);

    return res.status(500).json({
      message: "Error deleting goal.",
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};

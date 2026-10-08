const Goal = require("../models/Goal");

// @desc    Get all savings goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error: error.message });
  }
};

// @desc    Create a new goal
const createGoal = async (req, res) => {
  const { title, targetAmount, savedAmount, category, priority, targetDate } = req.body;

  if (!title || !targetAmount) {
    return res.status(400).json({ message: "Title and target amount are required" });
  }

  try {
    const goal = await Goal.create({
      title,
      targetAmount: Number(targetAmount),
      savedAmount: savedAmount ? Number(savedAmount) : 0,
      category: category || "General",
      priority: priority || "Medium",
      targetDate: targetDate || null,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Error creating goal", error: error.message });
  }
};

// @desc    Update goal or add funds
const updateGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, addAmount, category, priority, targetDate } = req.body;

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (title) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (category) goal.category = category;
    if (priority) goal.priority = priority; // <-- Added Priority Update Line
    if (targetDate !== undefined) goal.targetDate = targetDate;

    if (addAmount !== undefined) {
      goal.savedAmount += Number(addAmount);
    } else if (savedAmount !== undefined) {
      goal.savedAmount = Number(savedAmount);
    }

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error: error.message });
  }
};

// @desc    Delete a goal
const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
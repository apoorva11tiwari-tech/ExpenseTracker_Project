
const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController.js");

const verifyUser = require("../middleware/authMiddleware");

// Create an expense
router.post("/", verifyUser, addExpense);

// Get expenses
router.get("/", verifyUser, getExpenses);

// Delete an expense
router.delete("/:id", verifyUser, deleteExpense);

// Update an expense
router.put("/:id", verifyUser, updateExpense);

module.exports = router;

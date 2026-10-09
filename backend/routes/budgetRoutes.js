
const express = require("express");
const router = express.Router();

const {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const verifyUser = require("../middleware/authMiddleware");

// Get the logged-in user's budgets or create/update a budget.
router
  .route("/")
  .get(verifyUser, getBudgets)
  .post(verifyUser, addOrUpdateBudget);

// Delete one budget belonging to the logged-in user.
router
  .route("/:id")
  .delete(verifyUser, deleteBudget);

module.exports = router;

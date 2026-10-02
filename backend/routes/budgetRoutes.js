const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");
const {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.route("/")
  .get(getBudgets)
  .post(addOrUpdateBudget)
  .delete(async (req, res) => {
    try {
      await Budget.deleteMany({});
      res.status(200).json({ message: "All budgets deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budgets" });
    }
  });

router.route("/:id")
  .delete(deleteBudget);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.route("/")
  .get(getBudgets)
  .post(addOrUpdateBudget);

router.route("/:id")
  .delete(deleteBudget);

module.exports = router;
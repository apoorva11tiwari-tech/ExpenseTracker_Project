
const express = require("express");
const router = express.Router();

const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const verifyUser = require("../middleware/firebaseAuthMiddleware");

// Protect all Goals endpoints with Firebase authentication
router.route("/")
  .get(verifyUser, getGoals)
  .post(verifyUser, createGoal);

router.route("/:id")
  .put(verifyUser, updateGoal)
  .delete(verifyUser, deleteGoal);

module.exports = router;

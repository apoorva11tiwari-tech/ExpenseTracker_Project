
const express = require("express");

const router = express.Router();

const {
    addIncome,
    getIncomes,
    deleteIncome,
    updateIncome
} = require("../controllers/incomeController.js");

const verifyUser = require("../middleware/authMiddleware");

// Add income
router.post("/", verifyUser, addIncome);

// Get only authenticated user's incomes
router.get("/", verifyUser, getIncomes);

// Delete income
router.delete("/:id", verifyUser, deleteIncome);

// Update income
router.put("/:id", verifyUser, updateIncome);

module.exports = router;

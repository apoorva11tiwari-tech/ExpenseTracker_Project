const express = require("express");

const router = express.Router();

const {
    addIncome,
    getIncomes,
    deleteIncome,
    updateIncome
} = require("../controllers/incomeController.js");

router.post("/", addIncome);

router.get("/", getIncomes);

router.delete("/:id", deleteIncome);

router.put("/:id", updateIncome);

module.exports = router;
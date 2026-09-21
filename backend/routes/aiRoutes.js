const express = require("express");
const router = express.Router();
const { getAIBudgetRecommendations } = require("../controllers/aiController");

router.post("/budget-recommendations", getAIBudgetRecommendations);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getAiInsights, getBudgetRecommendations } = require("../controllers/aiController");

router.get("/", getAiInsights);

// Add this line to handle the POST request from your frontend
router.post("/budget-recommendations", getBudgetRecommendations);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getAiInsights,
  getBudgetRecommendations,
  allocateSavingsWithAI
} = require("../controllers/aiController");

router.get("/insights", getAiInsights);
router.post("/recommendations", getBudgetRecommendations);
router.post("/allocate", allocateSavingsWithAI);

module.exports = router;
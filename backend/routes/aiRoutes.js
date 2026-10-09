const express = require("express");
const router = express.Router();

const {
  getAiInsights,
  getBudgetRecommendations,
  allocateSavingsWithAI,
} = require("../controllers/aiController");

const verifyUser = require("../middleware/firebaseAuthMiddleware");

// Protect all AI endpoints with Firebase authentication
router.get("/insights", verifyUser, getAiInsights);
router.post("/recommendations", verifyUser, getBudgetRecommendations);
router.post("/allocate", verifyUser, allocateSavingsWithAI);

module.exports = router;
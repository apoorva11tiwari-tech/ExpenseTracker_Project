
const express = require("express");
const router = express.Router();

const { getAnalyticsSummary } = require("../controllers/analyticsController");
const verifyUser = require("../middleware/firebaseAuthMiddleware");

// Protect analytics with Firebase authentication
router.get("/", verifyUser, getAnalyticsSummary);

module.exports = router;

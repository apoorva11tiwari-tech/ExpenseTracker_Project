
const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markAsRead
} = require("../controllers/NotificationController");

const verifyUser = require("../middleware/firebaseAuthMiddleware");

// Protect all notification routes
router.get("/", verifyUser, getNotifications);
router.put("/:id/read", verifyUser, markAsRead);

module.exports = router;

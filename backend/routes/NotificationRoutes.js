
const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

const verifyUser = require("../middleware/authMiddleware");

// Protect all notification routes
router.get("/", verifyUser, getNotifications);
router.put("/:id/read", verifyUser, markAsRead);

module.exports = router;

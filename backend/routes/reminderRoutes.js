
const express = require("express");
const router = express.Router();

const {
    getReminders,
    addReminder,
    updateReminderStatus
} = require("../controllers/reminderController");

const verifyUser = require("../middleware/authMiddleware");

router.get("/", verifyUser, getReminders);
router.post("/", verifyUser, addReminder);
router.put("/:id/status", verifyUser, updateReminderStatus);

module.exports = router;

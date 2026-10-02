const express = require("express");
const router = express.Router();
const { getReminders, addReminder, updateReminderStatus } = require("../controllers/reminderController");

router.get("/", getReminders);
router.post("/", addReminder);
router.put("/:id/status", updateReminderStatus);

module.exports = router;
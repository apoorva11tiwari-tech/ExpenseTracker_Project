
const Reminder = require("../models/reminder");

// Get reminders belonging to the logged-in user
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({
            userId: req.user.uid
        }).sort({ dueDate: 1 });

        res.status(200).json(reminders);
    } catch (error) {
        console.error("Get reminders error:", error);
        res.status(500).json({
            message: "Failed to fetch reminders"
        });
    }
};

// Add a reminder for the logged-in user
const addReminder = async (req, res) => {
    try {
        const { title, amount, dueDate } = req.body;

        if (
            !title?.trim() ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) < 0 ||
            !dueDate ||
            Number.isNaN(new Date(dueDate).getTime())
        ) {
            return res.status(400).json({
                message: "Please provide a valid title, amount, and due date."
            });
        }

        const reminder = await Reminder.create({
            userId: req.user.uid,
            title: title.trim(),
            amount: Number(amount),
            dueDate
        });

        res.status(201).json(reminder);
    } catch (error) {
        console.error("Add reminder error:", error);
        res.status(500).json({
            message: "Failed to add reminder"
        });
    }
};

// Toggle status only for a reminder owned by the logged-in user
const updateReminderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({
                message: "Invalid reminder ID"
            });
        }

        const reminder = await Reminder.findOne({
            _id: id,
            userId: req.user.uid
        });

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        reminder.status =
            reminder.status === "Pending" ? "Paid" : "Pending";

        await reminder.save();

        res.status(200).json(reminder);
    } catch (error) {
        console.error("Update reminder status error:", error);
        res.status(500).json({
            message: "Failed to update reminder status"
        });
    }
};

module.exports = {
    getReminders,
    addReminder,
    updateReminderStatus
};

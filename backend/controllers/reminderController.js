const Reminder = require("../models/Reminder");

const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({}).sort({ dueDate: 1 });
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reminders", error: error.message });
    }
};

const addReminder = async (req, res) => {
    try {
        const { title, amount, dueDate } = req.body;
        const reminder = new Reminder({ title, amount, dueDate });
        const saved = await reminder.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Failed to add reminder", error: error.message });
    }
};

const updateReminderStatus = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        reminder.status = reminder.status === "Pending" ? "Paid" : "Pending";
        await reminder.save();
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ message: "Failed to update reminder", error: error.message });
    }
};

module.exports = { getReminders, addReminder, updateReminderStatus };
const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ date: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update notification", error: error.message });
    }
};

module.exports = { getNotifications, markAsRead };
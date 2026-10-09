
const Notification = require("../models/Notification");

// Get notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.uid;

        const notifications = await Notification.find({ userId })
            .sort({ date: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};

// Mark a notification as read only if it belongs to the logged-in user
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.uid;
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { read: true } },
            { new: true, runValidators: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        res.status(500).json({
            message: "Failed to update notification"
        });
    }
};

module.exports = { getNotifications, markAsRead };

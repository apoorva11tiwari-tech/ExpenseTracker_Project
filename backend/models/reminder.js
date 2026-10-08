const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Reminder", reminderSchema);
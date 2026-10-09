
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        dueDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);

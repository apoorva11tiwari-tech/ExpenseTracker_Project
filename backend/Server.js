
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const aiRoutes = require("./routes/aiRoutes");
const goalRoutes = require("./routes/goalRoute");
const notificationRoutes = require("./routes/notificationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary request logger
app.use((req, res, next) => {
  console.log("REQUEST RECEIVED:", req.method, req.originalUrl);
  next();
});

// Home route
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

// Admin routes
app.use("/api/admin", adminRoutes);

// Other API routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);

// Temporary diagnostic route
app.get("/check-admin-mount", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server route is working"
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server ONCE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("CHECK: UPDATED SERVER FILE IS RUNNING");
});

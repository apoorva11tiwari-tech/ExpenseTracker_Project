const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const loginRequestController = require("../controllers/loginRequest");
const authMiddleware = require("../middleware/authmiddleware");

router.post("/login", adminController.adminLogin);

router.get(
  "/users",
  authMiddleware.protect,
  authMiddleware.isAdmin,
  adminController.getAllUsers
);

router.get(
  "/stats",
  authMiddleware.protect,
  authMiddleware.isAdmin,
  adminController.getAdminStats
);

router.get(
  "/login-requests",
  authMiddleware.protect,
  authMiddleware.isAdmin,
  loginRequestController.getLoginRequests
);

router.patch(
  "/login-requests/:id",
  authMiddleware.protect,
  authMiddleware.isAdmin,
  loginRequestController.updateLoginRequest
);

module.exports = router;
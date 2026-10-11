
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({
        message: "Server authentication configuration error.",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists. Please log in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again.",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Authentication failed due to a server error.",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin privileges required.",
  });
};

module.exports = { protect, isAdmin };

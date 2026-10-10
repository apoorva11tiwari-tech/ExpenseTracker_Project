
const LoginRequest = require("../models/LoginRequest");

exports.getLoginRequests = async (req, res) => {
  try {
    const requests = await LoginRequest.find({ status: "Pending" })
      .select("_id method status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Login Requests Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch login requests.",
    });
  }
};

exports.updateLoginRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Denied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved or Denied.",
      });
    }

    const request = await LoginRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Login request not found.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(409).json({
        success: false,
        message: "This request has already been reviewed.",
      });
    }

    request.status = status;
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully.`,
      request: {
        id: request._id,
        status: request.status,
        reviewedAt: request.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Update Login Request Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update login request.",
    });
  }
};

console.log("LoginRequest controller loaded:", {
  getLoginRequests: typeof exports.getLoginRequests,
  updateLoginRequest: typeof exports.updateLoginRequest
});

exports.createLoginRequest = async (req, res) => {
  try {
    const { userId, method } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required."
      });
    }

    if (!["Email", "Google"].includes(method || "Email")) {
      return res.status(400).json({
        success: false,
        message: "Method must be Email or Google."
      });
    }

    const User = require("../models/User");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const existingRequest = await LoginRequest.findOne({
      userId,
      status: "Pending"
    });

    if (existingRequest) {
      return res.status(200).json({
        success: true,
        message: "A pending request already exists.",
        request: existingRequest
      });
    }

    const request = await LoginRequest.create({
      userId,
      method: method || "Email",
      status: "Pending"
    });

    return res.status(201).json({
      success: true,
      message: "Login request created successfully.",
      request
    });
  } catch (error) {
    console.error("Create Login Request Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create login request."
    });
  }
};


const {
  initializeApp,
  applicationDefault,
  getApps,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

const PROJECT_ID = "cashmate-6d10a";

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
  });
}

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await getAuth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };

    next();
  } catch (error) {
    console.error(
      "Firebase authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = verifyUser;

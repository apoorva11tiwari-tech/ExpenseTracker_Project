
const firebaseAdmin = require("../config/firebaseAdmin");

const firebaseAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required. Please log in."
            });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || null
        };

        next();
    } catch (error) {
        console.error("Firebase authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired Firebase token. Please log in again."
        });
    }
};

module.exports = firebaseAuthMiddleware;

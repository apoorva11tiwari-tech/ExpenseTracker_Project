
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let app;

if (getApps().length > 0) {
  app = getApps()[0];
} else {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);

    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
  }
}

module.exports = {
  auth: () => getAuth(app),
};

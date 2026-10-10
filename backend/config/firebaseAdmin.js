const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./cashmate-6d10a-399bb-firebase-adminsdk-fbsvc-4e535a818a.json");

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

module.exports = {
  auth: () => getAuth(app),
};
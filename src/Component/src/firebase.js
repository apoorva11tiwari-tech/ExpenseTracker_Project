import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "cashmate-6d10a.firebaseapp.com",
  projectId:  "cashmate-6d10a-399bb",
  storageBucket: "cashmate-6d10a.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
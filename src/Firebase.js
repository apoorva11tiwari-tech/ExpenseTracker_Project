import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// PASTE YOUR EXACT KEYS FROM FIREBASE HERE:
const firebaseConfig = {
  apiKey: "AIzaSyC1m5wXpCVk_DRp0OyGtIjWDcoA6mqUQg0",
  authDomain: "cashmate-6d10a.firebaseapp.com",
  projectId: "cashmate-6d10a",
  storageBucket: "cashmate-6d10a.appspot.com",
  messagingSenderId: "951867052172",
  appId:  "1:951867052172:web:a1059069b79c937e93eba9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
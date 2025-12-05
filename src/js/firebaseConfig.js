// Import Firebase SDK modules (using Firebase v9 modular syntax)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ---------------------------------------------------------
// Read Firebase configuration from Vite environment variables.
// These are defined in .env file as:
//
// VITE_FIREBASE_API_KEY=AIzaSyAxvvzh-rH0fe44lrH12MAM2elsdYbT1gI
// VITE_FIREBASE_AUTH_DOMAIN=mealwave-a7ba8.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=mealwave-a7ba8
// VITE_FIREBASE_APP_ID=1:495291116011:web:fae5ea6c33df88360391ae
// VITE_FIREBASE_STORAGE_BUCKET=mealwave-a7ba8.firebasestorage.app
//
// ⚠️ Note: Vite only exposes environment variables that start with "VITE_"
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

// ---------------------------------------------------------
// Initialize the Firebase app instance.
// This sets up the Firebase connection for your web app.
// ---------------------------------------------------------
const app = initializeApp(firebaseConfig);

// ---------------------------------------------------------
// Create and export the Firebase Authentication service.
// You can import "auth" anywhere to perform login, signup,
// or signout operations (that's why we export it).
// ---------------------------------------------------------
export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

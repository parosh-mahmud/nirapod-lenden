// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEEA-dH1ae0qog8Z_vD4Fj_-aLgzrsy0Y",
  authDomain: "nirapod-lenden.firebaseapp.com",
  databaseURL:
    "https://nirapod-lenden-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "nirapod-lenden",
  storageBucket: "nirapod-lenden.firebasestorage.app", // Verify this value if necessary
  messagingSenderId: "67130296684",
  appId: "1:67130296684:web:e85f437fb59d6ea416cb49",
  measurementId: "G-DLXZSHC65C",
};

// Initialize Firebase only if no app is already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);
// Initialize Analytics (only on the client)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase Realtime Database
const database = getDatabase(app);

// Initialize Authentication
const auth = getAuth(app);

export { auth, app, db, analytics, database, storage };

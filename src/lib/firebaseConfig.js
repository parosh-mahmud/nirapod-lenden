// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEEA-dH1ae0qog8Z_vD4Fj_-aLgzrsy0Y",
  authDomain: "nirapod-lenden.firebaseapp.com",
  projectId: "nirapod-lenden",
  storageBucket: "nirapod-lenden.firebasestorage.app",
  messagingSenderId: "67130296684",
  appId: "1:67130296684:web:e85f437fb59d6ea416cb49",
  measurementId: "G-DLXZSHC65C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);

export { auth, app, db, analytics };

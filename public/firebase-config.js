// Firebase configuration for client-side
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUoxQ4-LI98Y2gcdMAxfdqxRTs-4Al4pY",
  authDomain: "bonafide-tkr.firebaseapp.com",
  projectId: "bonafide-tkr",
  storageBucket: "bonafide-tkr.firebasestorage.app",
  messagingSenderId: "700867079118",
  appId: "1:700867079118:web:615821277b9b916331999f",
  measurementId: "G-NSJ1LRPV9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

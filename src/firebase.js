// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// MAIN Firebase Config (for Auth/Firestore)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// IOT Firebase Config (agrovihan-dev)
const iotFirebaseConfig = {
  apiKey: "AIzaSyB7An_aNOW_n7JckpqS20lDUW1qmjEBapI",
  authDomain: "agrovihan-dev.firebaseapp.com",
  databaseURL: "https://agrovihan-dev-default-rtdb.firebaseio.com",
  projectId: "agrovihan-dev",
  storageBucket: "agrovihan-dev.firebasestorage.app",
  messagingSenderId: "498305861240",
  appId: "1:498305861240:web:1535199f98235318444f8d",
  measurementId: "G-26WMV5QWQ4"
};

// Initialize Main Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize IoT Firebase App with unique name
const iotApp = initializeApp(iotFirebaseConfig, "iot");
export const iotDatabase = getDatabase(iotApp);

// Google Sign-In
const provider = new GoogleAuthProvider();
export const googleSignIn = () => signInWithPopup(auth, provider);

// Email/Password Sign-In
export const emailLogin = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDQLXQkZsy8OZMa1o0BqUg78sCH7N0aI6Q",
  authDomain: "yukthi-1d11d.firebaseapp.com",
  projectId: "yukthi-1d11d",
  storageBucket: "yukthi-1d11d.appspot.com",
  messagingSenderId: "609834599136",
  appId: "1:609834599136:web:c3765a7e40d78cba544685"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Sign-In
const provider = new GoogleAuthProvider();
export const googleSignIn = () => signInWithPopup(auth, provider);

// Email/Password Sign-In
export const emailLogin = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

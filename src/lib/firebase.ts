import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyDus_Sd1XnLmL571786ew2RZ-rtmnsLdIg",
  authDomain: "chatly-click.firebaseapp.com",
  projectId: "chatly-click",
  storageBucket: "chatly-click.appspot.com",
  messagingSenderId: "627979376686",
  appId: "1:627979376686:web:b44d9f77efc9a6ce5c27bf",
  measurementId: "G-JHL66P03SB",
});

export const firestore = getFirestore(app);
export const auth = getAuth(app);

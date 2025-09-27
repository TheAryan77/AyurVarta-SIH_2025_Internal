// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe8A1lt1WFvvEJVj63_545ICK176DdooA",
  authDomain: "ayurvarta-d9599.firebaseapp.com",
  projectId: "ayurvarta-d9599",
  storageBucket: "ayurvarta-d9599.firebasestorage.app",
  messagingSenderId: "852092731833",
  appId: "1:852092731833:web:a3257c8f72fc98f4faf668",
  measurementId: "G-PMHED120XM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics only if supported (optional, won't cause errors)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };
export default app;

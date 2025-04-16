// js/firebaseInit.js

// Import necessary functions from the Firebase SDK modules
// Ensure these versions match the ones included in your index.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

// Your web app's Firebase configuration provided from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDhK5EEmZ0yyhGpxtkZ0bjq5wQ3EVGcfPo", // Be cautious sharing API keys publicly
  authDomain: "couples-prayer-tracker.firebaseapp.com",
  projectId: "couples-prayer-tracker",
  storageBucket: "couples-prayer-tracker.appspot.com", // Corrected domain
  messagingSenderId: "608724593921",
  appId: "1:608724593921:web:30dfed677aae1400cfbf00",
  measurementId: "G-XF3Z4VNWNX" // Optional, for Google Analytics
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Get instances of Firestore and Authentication services
const db = getFirestore(app); // Firestore database instance
const auth = getAuth(app);    // Firebase Authentication instance

// Export the instances for use in other parts of your application (like alpineComponent.js)
export { db, auth };

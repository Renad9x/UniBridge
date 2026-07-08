// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJYuI-a1tOvlSMNl86hwHiYViXk59GlSo",
  authDomain: "projectauth-e8509.firebaseapp.com",
  projectId: "projectauth-e8509",
  storageBucket: "projectauth-e8509.firebasestorage.app",
  messagingSenderId: "219121039159",
  appId: "1:219121039159:web:10dfb3c77ec9f1c67a8cb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app);


export { auth,db };


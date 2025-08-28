// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCaM7V2tLH4qamTkqhWLNuBdmhwy8qqR4",
  authDomain: "habitmentor-ai.firebaseapp.com",
  projectId: "habitmentor-ai",
  storageBucket: "habitmentor-ai.firebasestorage.app",
  messagingSenderId: "96863368182",
  appId: "1:96863368182:web:9ffc7a1c56cd9a9b9ecdd7",
  measurementId: "G-24TBK5TT0T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);

// // firebaseConfig.ts
// import { initializeApp, getApps, FirebaseApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase config from console
// const firebaseConfig = {
//   apiKey: "AIzaSyCTKJ-LjpN1Syk7Mxhya7CO9BGVR-4KwP0",
//   authDomain: "habitmentor-ai.firebaseapp.com",
//   projectId: "habitmentor-ai",
//   storageBucket: "habitmentor-ai.appspot.com",
//   messagingSenderId: "96863368182",
//   appId: "1:96863368182:web:9ffc7a1c56cd9a9b9ecdd7",
//   measurementId: "G-24TBK5TT0T",
// };

// // Initialize app only if not already initialized
// const firebaseApp: FirebaseApp =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// // Export instances
// export const auth = getAuth(firebaseApp);
// export const firestore = getFirestore(firebaseApp);
// export default firebaseApp;

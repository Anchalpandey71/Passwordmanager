import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqQ7kUF6sWDEilksa5JWRliLYjIYD7vsU",
  authDomain: "passwordmanager-b91b6.firebaseapp.com",
  projectId: "passwordmanager-b91b6",
  storageBucket: "passwordmanager-b91b6.firebasestorage.app",
  messagingSenderId: "786147671427",
  appId: "1:786147671427:web:8b122a7b6f92b42e040ab6",
  measurementId: "G-D9DG7JDJ5P"
};
``
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Set up Google Auth Provider (No extra scopes needed for Firestore)
export const googleProvider = new GoogleAuthProvider();

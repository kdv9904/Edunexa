// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ailms-70154.firebaseapp.com",
  projectId: "ailms-70154",
  storageBucket: "ailms-70154.appspot.com",
  messagingSenderId: "881471766600",
  appId: "1:881471766600:web:072b6b1617f1353e5b987d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
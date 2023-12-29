// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTaGJFmmWzqrYp84aQBbfJXT1tWnQ2g3o",
  authDomain: "connecty-web-app.firebaseapp.com",
  projectId: "connecty-web-app",
  storageBucket: "connecty-web-app.appspot.com",
  messagingSenderId: "458878835244",
  appId: "1:458878835244:web:7f252eaea52891a2a48f89",
  measurementId: "G-C2HBHE3P08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

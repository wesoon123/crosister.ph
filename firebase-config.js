import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj5zfZCQH8U63B5vk8ASEzoTOthI4ENPE",
  authDomain: "crosisterph.firebaseapp.com",
  projectId: "crosisterph",
  storageBucket: "crosisterph.appspot.com", // ✅ Corrected
  messagingSenderId: "242782129687",
  appId: "1:242782129687:web:e41d3f678d526e97cb9652",
  measurementId: "G-5BF1ZXS4B5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db, addDoc, collection, deleteDoc, doc, getDocs, updateDoc };

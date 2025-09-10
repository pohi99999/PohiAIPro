import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyATHnvzt3Z_ezmNMDi-eVLO2N8CPyP_wtM",
  authDomain: "sys-70267508495646346072661892.firebaseapp.com",
  projectId: "sys-70267508495646346072661892",
  storageBucket: "sys-70267508495646346072661892.firebasestorage.app",
  messagingSenderId: "665687504996",
  appId: "1:665687504996:web:dad2f404450010b22d8771",
  measurementId: "G-1JZ3MRB7EJ"
};

// Initialize Firebase App only if it's not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics, app };
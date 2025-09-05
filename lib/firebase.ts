// Firebase initialization helper (modular v9+)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Move this configuration to environment variables for production
const firebaseConfig = {
  apiKey: "AIzaSyDZaoyLDM79Q7s4sPc87XZwspBm6-oFSZM",
  authDomain: "pohi-ai-pro.firebaseapp.com",
  projectId: "pohi-ai-pro",
  storageBucket: "pohi-ai-pro.appspot.com",
  messagingSenderId: "608181723722",
  appId: "1:608181723722:web:3ee22066cb6db5c666bcb3",
  measurementId: "G-E86YM48DL3"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export default app;

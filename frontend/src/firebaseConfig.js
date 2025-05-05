import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// New Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp_3snUH6scy4e0bzJHrgEhPFp_djL47M",
  authDomain: "parabiz-store.firebaseapp.com",
  projectId: "parabiz-store",
  storageBucket: "parabiz-store.appspot.com",
  messagingSenderId: "451395026600",
  appId: "1:451395026600:web:3171da0218b2a52a1f4c9d",
  measurementId: "G-3RH1QR0ZXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

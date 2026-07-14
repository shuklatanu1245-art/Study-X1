import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlLP5b5d6yHU9bXUfrc8DQiQocHm42ErY",
  authDomain: "studyx-8ea20.firebaseapp.com",
  projectId: "studyx-8ea20",
  storageBucket: "studyx-8ea20.firebasestorage.app",
  messagingSenderId: "708689925545",
  appId: "1:708689925545:web:5e27fc44b7d3540034e0b8",
  measurementId: "G-ZRCZ7S43Q6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

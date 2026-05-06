import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1qEAfobMSPKmhsRAHYp2QN8_f0S4o_jY",
  authDomain: "nextrack-63fff.firebaseapp.com",
  projectId: "nextrack-63fff",
  storageBucket: "nextrack-63fff.firebasestorage.app",
  messagingSenderId: "616540139798",
  appId: "1:616540139798:web:b7b2af72a7bedf61072037",
  measurementId: "G-8SJH7DH9TW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

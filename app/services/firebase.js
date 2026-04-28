import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyABnlcP99Byil9UKV_AaMdeyiismApmuBg",
  authDomain: "sigap-181fe.firebaseapp.com",
  projectId: "sigap-181fe",
  storageBucket: "sigap-181fe.firebasestorage.app",
  messagingSenderId: "165978337318",
  appId: "1:165978337318:web:2efbc481baa5dc819bf6e7",
  measurementId: "G-9MECPR95V3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default {};
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK1JmSBG6pYvvoiM68ARCd2sn_jB5ndE8",
  authDomain: "incident-ready-app.firebaseapp.com",
  projectId: "incident-ready-app",
  storageBucket: "incident-ready-app.firebasestorage.app",
  messagingSenderId: "548991283119",
  appId: "1:548991283119:web:09f6e961e439a2d841895a",
  measurementId: "G-DFVC0ETYRM",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
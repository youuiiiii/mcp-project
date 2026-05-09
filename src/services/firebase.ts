import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABnlcP99Byil9UKV_AaMdeyiismApmuBg",
  authDomain: "sigap-181fe.firebaseapp.com",
  projectId: "sigap-181fe",
  storageBucket: "sigap-181fe.firebasestorage.app",
  messagingSenderId: "165978337318",
  appId: "1:165978337318:web:2efbc481baa5dc819bf6e7",
  measurementId: "G-9MECPR95V3",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: any) {
    if (error?.code === "auth/already-initialized") {
      return getAuth(app);
    }

    throw error;
  }
})();

export const db = getFirestore(app);
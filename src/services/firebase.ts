import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCprOdxoq23MgBNHCLEMpyjD7feXxaKpz8",
  authDomain: "mcp-project-4864d.firebaseapp.com",
  projectId: "mcp-project-4864d",
  storageBucket: "mcp-project-4864d.firebasestorage.app",
  messagingSenderId: "898382057997",
  appId: "1:898382057997:web:18f2d93c06ad6d5a687b44"
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
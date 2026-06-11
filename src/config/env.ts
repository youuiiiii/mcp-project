type EnvKey =
  | "EXPO_PUBLIC_FIREBASE_API_KEY"
  | "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
  | "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
  | "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
  | "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  | "EXPO_PUBLIC_FIREBASE_APP_ID"
  | "EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME"
  | "EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
  | "EXPO_PUBLIC_MODERATOR_EMAILS";

const readRequiredEnv = (key: EnvKey, value: string | undefined): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return trimmedValue;
};

const readOptionalEnv = (value: string | undefined): string | null => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
};

export const firebaseConfig = {
  apiKey: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY
  ),
  authDomain: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  ),
  projectId: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  ),
  storageBucket: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  ),
  messagingSenderId: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: readRequiredEnv(
    "EXPO_PUBLIC_FIREBASE_APP_ID",
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  ),
};

export const cloudinaryConfig = {
  cloudName: readRequiredEnv(
    "EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME",
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  ),
  uploadPreset: readRequiredEnv(
    "EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  ),
};

export const demoModeratorEmails = (
  readOptionalEnv(process.env.EXPO_PUBLIC_MODERATOR_EMAILS) ?? ""
)
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

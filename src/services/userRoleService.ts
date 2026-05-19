import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { demoModeratorEmails } from "../config/env";
import { db } from "./firebase";

export type UserRole = "reporter" | "moderator" | "admin";

export type UserRoleSource = "custom_claim" | "firestore" | "env" | "default";

export type UserAccess = {
  role: UserRole;
  isModerator: boolean;
  source: UserRoleSource;
};

const ROLE_COLLECTION = "user_roles";

const MODERATOR_ROLES: readonly UserRole[] = ["moderator", "admin"];

const normalizeRole = (value: unknown): UserRole | null => {
  if (value === "reporter" || value === "moderator" || value === "admin") {
    return value;
  }

  return null;
};

const isModeratorRole = (role: UserRole) => {
  return MODERATOR_ROLES.includes(role);
};

const getEnvAccess = (user: User): UserAccess | null => {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    return null;
  }

  if (!demoModeratorEmails.includes(email)) {
    return null;
  }

  return {
    role: email === "admin@gmail.com" ? "admin" : "moderator",
    isModerator: true,
    source: "env",
  };
};

const getFirestoreAccess = async (user: User): Promise<UserAccess | null> => {
  try {
    const roleSnapshot = await getDoc(doc(db, ROLE_COLLECTION, user.uid));

    if (!roleSnapshot.exists()) {
      return null;
    }

    const roleData = roleSnapshot.data();
    const firestoreRole = normalizeRole(roleData.role);

    if (firestoreRole) {
      return {
        role: firestoreRole,
        isModerator:
          isModeratorRole(firestoreRole) || roleData.isModerator === true,
        source: "firestore",
      };
    }

    if (roleData.isModerator === true) {
      return {
        role: "moderator",
        isModerator: true,
        source: "firestore",
      };
    }

    return null;
  } catch (error) {
    console.warn("Role document lookup skipped:", error);
    return null;
  }
};

export const getUserAccess = async (user: User): Promise<UserAccess> => {
  const token = await user.getIdTokenResult(true);
  const claimRole = normalizeRole(token.claims.role);

  if (claimRole) {
    return {
      role: claimRole,
      isModerator:
        isModeratorRole(claimRole) || token.claims.moderator === true,
      source: "custom_claim",
    };
  }

  if (token.claims.moderator === true) {
    return {
      role: "moderator",
      isModerator: true,
      source: "custom_claim",
    };
  }

  const envAccess = getEnvAccess(user);

  if (envAccess) {
    return envAccess;
  }

  const firestoreAccess = await getFirestoreAccess(user);

  if (firestoreAccess) {
    return firestoreAccess;
  }

  return {
    role: "reporter",
    isModerator: false,
    source: "default",
  };
};
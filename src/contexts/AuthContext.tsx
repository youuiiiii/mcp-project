import {
  User,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { googleAuthClientIds } from "../config/env";
import { auth } from "../services/firebase";
import {
  getUserAccess,
  type UserRole,
  type UserRoleSource,
} from "../services/userRoleService";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  role: UserRole;
  roleSource: UserRoleSource;
  roleLoading: boolean;
  isModerator: boolean;
  profileRevision: number;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (payload: {
    displayName?: string;
    photoURL?: string | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextValue | null>(null);
const missingGoogleClientId = "missing-google-client-id.apps.googleusercontent.com";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>("reporter");
  const [roleSource, setRoleSource] = useState<UserRoleSource>("default");
  const [roleLoading, setRoleLoading] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [profileRevision, setProfileRevision] = useState(0);
  const pendingGoogleLoginRef = useRef<{
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);

  const activeGoogleClientId = Platform.select({
    android: googleAuthClientIds.android,
    ios: googleAuthClientIds.ios,
    default: googleAuthClientIds.web,
  });

  const [, googleAuthResponse, promptGoogleAuth] = Google.useIdTokenAuthRequest({
    androidClientId: googleAuthClientIds.android ?? missingGoogleClientId,
    iosClientId: googleAuthClientIds.ios ?? missingGoogleClientId,
    webClientId: googleAuthClientIds.web ?? missingGoogleClientId,
    selectAccount: true,
  });

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        setRole("reporter");
        setRoleSource("default");
        setIsModerator(false);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);

      getUserAccess(currentUser)
        .then((access) => {
          if (cancelled) {
            return;
          }

          setRole(access.role);
          setRoleSource(access.source);
          setIsModerator(access.isModerator);
        })
        .catch((error) => {
          console.error("Role lookup error:", error);

          if (cancelled) {
            return;
          }

          setRole("reporter");
          setRoleSource("default");
          setIsModerator(false);
        })
        .finally(() => {
          if (!cancelled) {
            setRoleLoading(false);
          }
        });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const pendingGoogleLogin = pendingGoogleLoginRef.current;

    if (!pendingGoogleLogin || !googleAuthResponse) {
      return;
    }

    if (googleAuthResponse.type !== "success") {
      pendingGoogleLoginRef.current = null;
      pendingGoogleLogin.reject(new Error("Google sign-in was cancelled."));
      return;
    }

    const finishGoogleLogin = async () => {
      const idToken =
        googleAuthResponse.params.id_token ??
        googleAuthResponse.authentication?.idToken;
      const accessToken =
        googleAuthResponse.params.access_token ??
        googleAuthResponse.authentication?.accessToken;

      if (!idToken && !accessToken) {
        throw new Error("Google did not return an auth token.");
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, credential);
    };

    finishGoogleLogin()
      .then(() => {
        pendingGoogleLoginRef.current = null;
        pendingGoogleLogin.resolve();
      })
      .catch((error) => {
        pendingGoogleLoginRef.current = null;
        pendingGoogleLogin.reject(
          error instanceof Error
            ? error
            : new Error("Could not sign in with Google.")
        );
      });
  }, [googleAuthResponse]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const register = async (name: string, email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await updateProfile(credential.user, {
      displayName: name.trim(),
    });

    setUser(credential.user);
    setProfileRevision((current) => current + 1);
  };

  const updateUserProfile: AuthContextValue["updateUserProfile"] = async (
    payload
  ) => {
    if (!auth.currentUser) {
      throw new Error("User belum login.");
    }

    await updateProfile(auth.currentUser, payload);
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    setProfileRevision((current) => current + 1);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfileRevision((current) => current + 1);
  };

  const loginWithGoogle = useCallback(async () => {
    if (!activeGoogleClientId) {
      throw new Error(
        "Google sign-in needs OAuth client IDs. Add EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID for Android builds."
      );
    }

    const googleLoginCompletion = new Promise<void>((resolve, reject) => {
      pendingGoogleLoginRef.current = { resolve, reject };
    });

    const promptResult = await promptGoogleAuth();

    if (promptResult.type !== "success") {
      pendingGoogleLoginRef.current = null;
      throw new Error("Google sign-in was cancelled.");
    }

    if (promptResult.params.id_token || promptResult.authentication?.idToken) {
      pendingGoogleLoginRef.current = null;
      const credential = GoogleAuthProvider.credential(
        promptResult.params.id_token ?? promptResult.authentication?.idToken,
        promptResult.params.access_token ?? promptResult.authentication?.accessToken
      );
      await signInWithCredential(auth, credential);
      return;
    }

    await googleLoginCompletion;
  }, [activeGoogleClientId, promptGoogleAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      role,
      roleSource,
      roleLoading,
      isModerator,
      profileRevision,
      login,
      register,
      updateUserProfile,
      logout,
      loginWithGoogle,
    }),
    [
      user,
      loading,
      role,
      roleSource,
      roleLoading,
      isModerator,
      profileRevision,
      loginWithGoogle,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

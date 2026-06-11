import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

const AuthContext = createContext<AuthContextValue | null>(null);

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

  const loginWithGoogle = async () => {
    alert("Google Sign In is not available on this platform yet.");
  };

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
    [user, loading, role, roleSource, roleLoading, isModerator, profileRevision]
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

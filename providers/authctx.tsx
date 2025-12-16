import { createUser, setUserDisplayName, signIn, signOut } from "@/api/authApi";
import { auth } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  signIn: (userEmail: string, password: string) => void;
  signOut: VoidFunction;
  createUser: (email: string, password: string, displayName: string) => void;
  userNameSession?: string | null;
  isLoading: boolean;
  user: User | null;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
      "UseAuthSession must be used within an AuthContext Porivder"
    );
  }

  return value;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(true);

      if (user) {
        setUserSession(user.displayName);
        setUserAuthSession(user);
      } else {
        setUserSession(null);
        setUserAuthSession(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (userAuthSession) {
      router.replace("/");
    }
  }, [isLoading, userAuthSession]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (userEmail: string, password: string) => {
          setAuthError(null);
          signIn(userEmail, password).catch((err) => {
            console.error("Sign-in failed:", err);
            setAuthError(getErrorMessage("auth", "INVALID_CREDENTIALS"));
          });
        },
        signOut: () => {
          signOut().catch((err) => {
            console.error("Sign-out failed:", err);
          });
        },
        createUser: async (
          email: string,
          password: string,
          displayName: string
        ) => {
          try {
            const newUser = await createUser(email, password);
            if (newUser) {
              await setUserDisplayName(newUser, displayName);
              setUserSession(displayName);
              setAuthError(null);
            }
          } catch (err) {
            console.error("Create user failed:", err);
          }
        },
        userNameSession: userSession,
        isLoading: isLoading,
        user: userAuthSession,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

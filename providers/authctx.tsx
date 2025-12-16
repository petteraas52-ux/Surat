import { createUser, setUserDisplayName, signIn, signOut } from "@/api/authApi";
import { auth, db } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
  userRole: "parent" | "employee" | null;
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
  const [userRole, setUserRole] = useState<"parent" | "employee" | null>(null);

  const router = useRouter();

  const fetchUserRoleFromDatabase = async (
    uid: string
  ): Promise<"parent" | "employee" | null> => {
    const employeeDoc = await getDoc(doc(db, "employees", uid));
    if (employeeDoc.exists()) {
      return "employee";
    }

    const parentDoc = await getDoc(doc(db, "parents", uid));
    if (parentDoc.exists()) {
      return "parent";
    }

    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setUserRole(null);

      if (user) {
        setUserSession(user.displayName);
        setUserAuthSession(user);

        try {
          const role = await fetchUserRoleFromDatabase(user.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setAuthError("Failed to load user profile. Please try again.");
        }
      } else {
        setUserSession(null);
        setUserAuthSession(null);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading || !userAuthSession) {
      return;
    }

    if (userRole === "employee") {
      router.replace("../employee");
    } else if (userRole === "parent") {
      router.replace("../parent");
    } else if (userRole === null) {
      router.replace("../role-error");
    }
  }, [isLoading, userAuthSession, userRole]);

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
        userRole: userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

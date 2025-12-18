/**
 * AUTH SESSION PROVIDER
 * * ROLE:
 * The primary security and routing engine of the application.
 * * CORE FUNCTIONALITY:
 * 1. Global Auth State: Maintains a persistent record of the logged-in Firebase user
 * across the entire component tree.
 * 2. Role-Based Access Control (RBAC): Upon login, it queries the 'employees' and
 * 'parents' Firestore collections to determine the user's permissions.
 * 3. Automatic Navigation: Automatically redirects users to the correct dashboard
 * ('/employee' or '/parent') as soon as their identity and role are verified.
 * 4. Error Management: Centralizes authentication errors (like invalid credentials)
 * for display on the login screen.
 */

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

// Definitions for the global authentication context state
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

/**
 * useAuthSession
 * Custom hook to allow components to access user data and auth methods easily.
 */
export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
      "UseAuthSession must be used within an AuthContext Provider"
    );
  }

  return value;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  // --- STATE ---
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"parent" | "employee" | null>(null);

  const router = useRouter();

  /**
   * fetchUserRoleFromDatabase
   * Helper function to identify the user type by checking specialized collections.
   */
  const fetchUserRoleFromDatabase = async (
    uid: string
  ): Promise<"parent" | "employee" | null> => {
    // Check if the user exists in the staff directory
    const employeeDoc = await getDoc(doc(db, "employees", uid));
    if (employeeDoc.exists()) {
      return "employee";
    }

    // Otherwise, check if they are registered as a parent
    const parentDoc = await getDoc(doc(db, "parents", uid));
    if (parentDoc.exists()) {
      return "parent";
    }

    return null; // No role assigned
  };

  /**
   * AUTH LISTENER
   * Listens to Firebase Auth state changes (login, logout, or session recovery on boot).
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setUserRole(null);

      if (user) {
        setUserSession(user.displayName);
        setUserAuthSession(user);

        try {
          // Identify permissions as soon as the user is authenticated
          const role = await fetchUserRoleFromDatabase(user.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setAuthError(getErrorMessage("general", "UNKNOWN"));
        }
      } else {
        // Clear all session data on logout
        setUserSession(null);
        setUserAuthSession(null);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * ROUTING LOGIC
   * Automatically moves the user to their respective dashboard based on their role.
   */
  useEffect(() => {
    if (isLoading || !userAuthSession) {
      return;
    }

    if (userRole === "employee") {
      router.replace("../employee");
    } else if (userRole === "parent") {
      router.replace("../parent");
    } else if (userRole === null) {
      // Handle edge case where a user is in Auth but not in a database role
      router.replace("../role-error");
    }
  }, [isLoading, userAuthSession, userRole]);

  return (
    <AuthContext.Provider
      value={{
        /**
         * signIn
         * Authenticates user and catches standard errors (like wrong password).
         */
        signIn: (userEmail: string, password: string) => {
          setAuthError(null);
          signIn(userEmail, password).catch((err) => {
            console.error("Sign-in failed:", err);
            setAuthError(getErrorMessage("auth", "INVALID_CREDENTIALS"));
          });
        },

        /**
         * signOut
         * Logs the user out of Firebase, triggering the routing logic back to login.
         */
        signOut: () => {
          signOut().catch((err) => {
            console.error("Sign-out failed:", err);
          });
        },

        /**
         * createUser
         * Standard registration flow: Creates user -> Sets Name -> Updates session.
         */
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

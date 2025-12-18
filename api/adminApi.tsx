/**
 * AUTHENTICATION SERVICE (ADMIN ACTIONS)
 * * CRUCIAL: Standard Firebase Auth 'createUser' automatically logs in the new user.
 * To allow an Admin to create accounts for OTHERS without being logged out themselves,
 * we must bypass the client SDK and use this Cloud Function instead.
 */

import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

/**
 * adminCreateUser:
 * This triggers a server-side script (Node.js Admin SDK).
 * It is the ONLY way to create users and assign roles (Custom Claims)
 * simultaneously while maintaining the Admin's current session.
 */
const adminCreateUser = httpsCallable(functions, "adminCreateUser");

export const createAccountViaAdmin = async (
  email: string,
  password: string,
  displayName: string,
  role: "parent" | "employee" | "admin",
  additionalData: any
) => {
  try {
    // This call passes all profile and permission data to the backend.
    // The backend must verify the requester's Admin status before processing.
    const result = await adminCreateUser({
      email,
      password,
      displayName,
      role,
      additionalData,
    });

    return result.data;
  } catch (error) {
    // Failure here usually means the email is a duplicate or
    // the requester lacks 'admin' custom claims.
    console.error("Cloud Function Error:", error);
    throw error;
  }
};

import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
// "adminCreateUser" must match the name in your index.ts
const adminCreateUser = httpsCallable(functions, "adminCreateUser");

export const createAccountViaAdmin = async (
  email: string,
  password: string,
  displayName: string,
  role: "parent" | "employee",
  additionalData: any
) => {
  try {
    const result = await adminCreateUser({
      email,
      password,
      displayName,
      role,
      additionalData,
    });
    return result.data;
  } catch (error) {
    console.error("Cloud Function Error:", error);
    throw error;
  }
};

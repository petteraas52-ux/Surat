import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();

/**
 * Updated for Firebase Functions v2 syntax
 */
export const adminCreateUser = onCall(async (request) => {
  // 1. Security Check: Access auth via request.auth
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // 2. Access data via request.data
  const { email, password, displayName, role, additionalData } = request.data;
  const collectionName = role === "employee" ? "employees" : "parents";

  try {
    // 3. Create the Auth User
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // 4. Create the Firestore Document
    await admin
      .firestore()
      .collection(collectionName)
      .doc(userRecord.uid)
      .set({
        ...additionalData,
        uid: userRecord.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("Creation Error:", error);
    throw new HttpsError("internal", error.message);
  }
});

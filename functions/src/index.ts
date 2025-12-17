import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();

export const adminCreateUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { email, password, displayName, role, additionalData } = request.data;
  const collectionName = role === "employee" ? "employees" : "parents";

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

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

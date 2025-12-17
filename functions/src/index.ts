import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();

export const adminCreateUser = onCall(async (request) => {
  // 1. Security: Only authenticated users can call this
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in.");
  }

  const { email, password, displayName, role, additionalData } = request.data;

  // 2. Routing: Admin/Employee -> employees table, Parent -> parents table
  const isStaff = role === "admin" || role === "employee";
  const collectionName = isStaff ? "employees" : "parents";

  try {
    // 3. Create Auth User
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // 4. Save to Firestore with the role included
    await admin
      .firestore()
      .collection(collectionName)
      .doc(userRecord.uid)
      .set({
        ...additionalData,
        uid: userRecord.uid,
        role: role, // Essential for your TabBar logic
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("User Creation Error:", error);
    throw new HttpsError("internal", error.message);
  }
});

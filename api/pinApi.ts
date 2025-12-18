import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * PIN API SERVICE
 * This service manages the local 4-digit PIN used for quick access/actions.
 * Because PINs are stored on the user document but users are split between
 * 'parents' and 'employees', we must check both collections.
 */

const users = ["parents", "employees"] as const;

/**
 * GET USER PIN
 * CRUCIAL LOGIC: Sequential Lookup.
 * Since the Auth UID doesn't tell us if the user is a Parent or Employee,
 * we loop through both collections until we find the document.
 * Returns null if no PIN is set or user doesn't exist.
 */
export async function getUserPin(uid: string) {
  for (const collectionName of users) {
    const snap = await getDoc(doc(db, collectionName, uid));
    if (snap.exists()) {
      // Return the pin field if it exists, otherwise null
      return snap.data().pin ?? null;
    }
  }
  return null;
}

/**
 * SET USER PIN
 * CRUCIAL LOGIC: Safe Merging.
 * 1. Find which collection the user belongs to.
 * 2. Use '{ merge: true }' to ensure we only update/add the 'pin' field
 * without accidentally deleting the rest of the user's profile data.
 * @param uid - The unique ID of the user from Firebase Auth.
 * @param pin - The 4-digit string to be saved.
 */
export async function setUserPin(uid: string, pin: string) {
  let targetCollection: (typeof users)[number] | null = null;

  // Step 1: Identify the collection (Parent or Employee?)
  for (const collectionName of users) {
    const ref = doc(db, collectionName, uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      targetCollection = collectionName;
      break;
    }
  }

  // Step 2: Update the specific document
  if (targetCollection) {
    const ref = doc(db, targetCollection, uid);

    /**
     * Why setDoc with merge?
     * setDoc is generally safer than updateDoc when you aren't 100%
     * sure if the 'pin' field already exists. 'merge: true' prevents
     * the rest of the document from being wiped.
     */
    await setDoc(ref, { pin }, { merge: true });
    return;
  }

  // If we reach here, the UID exists in Auth but not in our Firestore schema
  throw new Error("User not found in any collection");
}

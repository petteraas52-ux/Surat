import { auth, db } from "@/firebaseConfig";
import { ParentProps } from "@/types/parentData";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

/**
 * PARENTS COLLECTION REFERENCE
 * Manages the data profiles for parents.
 */
const parentsCol = collection(db, "parents");

/**
 * CREATE PARENT
 * CRUCIAL LOGIC:
 * 1. Auth Creation: Creates the user in Firebase Authentication.
 * 2. Data Linking: Uses 'setDoc' with the Auth 'uid'.
 * WHY? By making the Document ID the same as the Auth UID, we simplify
 * security rules and avoid complex queries to find a user's data after login.
 */
export const createParent = async (
  email: string,
  temporaryPassword: string,
  data: Omit<ParentProps, "id">
): Promise<string> => {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    email,
    temporaryPassword
  );

  const uid = user.uid;

  // Initialize the parent document with an empty children array
  await setDoc(doc(db, "parents", uid), {
    ...data,
    eMail: email,
    children: [], // Initialized empty; populated via addChildToParent
  });

  return uid;
};

/**
 * ADD CHILD TO PARENT
 * CRUCIAL LOGIC: arrayUnion.
 * This is an atomic operation. It adds the childUid to the 'children' array
 * ONLY if it doesn't already exist. This prevents duplicate entries if the
 * function is called multiple times.
 */
export const addChildToParent = async (parentUid: string, childUid: string) => {
  console.log(
    `[addChildToParent] Attempting to add child ${childUid} to parent ${parentUid}`
  );
  const parentRef = doc(db, "parents", parentUid);

  try {
    await updateDoc(parentRef, {
      children: arrayUnion(childUid),
    });
    console.log(`[addChildToParent] Successfully updated parent ${parentUid}`);
  } catch (error) {
    console.error(
      `[addChildToParent] Failed to update parent ${parentUid}:`,
      error
    );
    throw error;
  }
};

/**
 * GET SINGLE PARENT
 * Fetches parent profile using their unique ID.
 */
export const getParent = async (id: string): Promise<ParentProps | null> => {
  const snap = await getDoc(doc(db, "parents", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<ParentProps, "id">),
  };
};

/**
 * GET ALL PARENTS
 * Standard fetch for admin dashboard lists.
 */
export const getAllParents = async (): Promise<ParentProps[]> => {
  const snap = await getDocs(parentsCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ParentProps, "id">),
  }));
};

/**
 * UPDATE PARENT
 * Uses 'Partial' to allow updating specific fields (e.g., just the phone number)
 * without risking overwriting the 'children' array or other metadata.
 */
export const updateParent = async (
  id: string,
  data: Partial<Omit<ParentProps, "id">>
) => {
  const parentRef = doc(db, "parents", id);
  await updateDoc(parentRef, data);
};

/**
 * DELETE PARENT
 * Removes the document from Firestore.
 * Note: Does not automatically remove the user from Firebase Auth.
 */
export const deleteParent = async (id: string) => {
  const parentRef = doc(db, "parents", id);
  await deleteDoc(parentRef);
};

/**
 * UPDATE PROFILE IMAGE
 * Logic flow:
 * 1. Upload the raw file to Firebase Storage.
 * 2. If successful, update the Firestore document with the persistent path.
 */
export const updateParentProfileImage = async (
  parentId: string,
  imageUri: string
): Promise<string | null> => {
  try {
    const storagePath = await uploadImageToFirebase(imageUri);
    if (!storagePath) return null;

    await updateParent(parentId, { imageUri: storagePath });
    console.log("Parent profile image updated successfully");
    return storagePath;
  } catch (e) {
    console.error("Error updating parent profile image:", e);
    return null;
  }
};

import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

/** * Firestore Collection Reference
 * Points to the 'children' collection in the database.
 */
const childrenCol = collection(db, "children");

/**
 * CREATE CHILD
 * Standard Firestore addDoc.
 * 'Omit' is used in the type to ensure we don't try to manually pass an 'id',
 * as Firestore generates the document ID automatically.
 */
export const createChild = async (data: Omit<ChildProps, "id">) => {
  const docRef = await addDoc(childrenCol, data);
  return docRef.id;
};

/**
 * GET SINGLE CHILD
 * Fetches one document by ID and merges the Firestore ID with the document data.
 */
export const getChild = async (id: string): Promise<ChildProps | null> => {
  const snap = await getDoc(doc(db, "children", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<ChildProps, "id">),
  };
};

/**
 * GET ALL CHILDREN
 * Fetches every document in the 'children' collection.
 * Note: For larger apps, this should eventually be paginated to save bandwidth.
 */
export const getAllChildren = async (): Promise<ChildProps[]> => {
  try {
    const snap = await getDocs(childrenCol);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ChildProps, "id">),
    }));
  } catch (error) {
    console.error("Error in getAllChildren API:", error);
    throw error;
  }
};

/**
 * GET CHILDREN FOR PARENT
 * CRUCIAL LOGIC: In Firestore, 'parents' is stored as an array of UIDs.
 * The 'array-contains' query allows us to find all children where
 * a specific Parent's ID is listed in that array.
 */
export const getChildrenForParent = async (
  parentId: string
): Promise<ChildProps[]> => {
  const q = query(childrenCol, where("parents", "array-contains", parentId));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChildProps, "id">),
  }));
};

/**
 * UPDATE ALLERGIES
 * A specific helper for updating the allergy array without touching other fields.
 */
export const updateChildAllergies = async (
  childId: string,
  allergies: string[]
) => {
  const childRef = doc(db, "children", childId);
  await updateDoc(childRef, { allergies });
};

/**
 * UNIVERSAL CHILD UPDATE
 * Uses 'Partial' to allow updating only specific fields (e.g. just 'firstName').
 * This prevents overwriting the entire document when only one change is needed.
 */
export const updateChild = async (
  id: string,
  data: Partial<Omit<ChildProps, "id">>
) => {
  const childRef = doc(db, "children", id);
  await updateDoc(childRef, data);
};

/**
 * DELETE CHILD
 * Permanently removes the child document from Firestore.
 */
export const deleteChild = async (id: string) => {
  const childRef = doc(db, "children", id);
  await deleteDoc(childRef);
};

/**
 * UPDATE CHILD PROFILE IMAGE
 * WORKFLOW:
 * 1. Uploads the raw local image URI to Firebase Storage.
 * 2. If successful, updates the Firestore 'imageUri' field with the permanent storage path.
 * This ensures we don't save a database reference to an image that failed to upload.
 */
export const updateChildProfileImage = async (
  childId: string,
  imageUri: string
): Promise<string | null> => {
  try {
    const storagePath = await uploadImageToFirebase(imageUri);
    if (!storagePath) return null;

    await updateChild(childId, { imageUri: storagePath });
    console.log("Child profile image updated successfully");
    return storagePath;
  } catch (e) {
    console.error("Error updating child profile image:", e);
    return null;
  }
};

/**
 * GET CHILDREN BY DEPARTMENT
 * Used by teachers/employees to see only the children in their specific group.
 */
export const getChildrenForDepartment = async (
  department: string
): Promise<ChildProps[]> => {
  const q = query(childrenCol, where("department", "==", department));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChildProps, "id">),
  }));
};

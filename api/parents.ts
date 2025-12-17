import { auth, db } from "@/firebaseConfig";
import { ParentProps } from "@/types/parent";
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

const parentsCol = collection(db, "parents");

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

  await setDoc(doc(db, "parents", uid), {
    ...data,
    eMail: email,
    children: [],
  });

  return uid;
};

export const getParent = async (id: string): Promise<ParentProps | null> => {
  const snap = await getDoc(doc(db, "parents", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<ParentProps, "id">),
  };
};

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

export const getAllParents = async (): Promise<ParentProps[]> => {
  const snap = await getDocs(parentsCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ParentProps, "id">),
  }));
};

export const updateParent = async (
  id: string,
  data: Partial<Omit<ParentProps, "id">>
) => {
  const parentRef = doc(db, "parents", id);
  await updateDoc(parentRef, data);
};

export const deleteParent = async (id: string) => {
  const parentRef = doc(db, "parents", id);
  await deleteDoc(parentRef);
};

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

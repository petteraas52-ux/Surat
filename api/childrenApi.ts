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

const childrenCol = collection(db, "children");

export const createChild = async (data: Omit<ChildProps, "id">) => {
  const docRef = await addDoc(childrenCol, data);
  return docRef.id;
};

export const getChild = async (id: string): Promise<ChildProps | null> => {
  const snap = await getDoc(doc(db, "children", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<ChildProps, "id">),
  };
};

export const getAllChildren = async (): Promise<ChildProps[]> => {
  const snap = await getDocs(childrenCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChildProps, "id">),
  }));
};

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

export const updateChild = async (
  id: string,
  data: Partial<Omit<ChildProps, "id">>
) => {
  const childRef = doc(db, "children", id);
  await updateDoc(childRef, data);
};

export const deleteChild = async (id: string) => {
  const childRef = doc(db, "children", id);
  await deleteDoc(childRef);
};

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

/* import { db } from "@/firebaseConfig";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

export type ParentDoc = {
    name: string;
    phone: string;
    email?: string;
    relationship: "mother" | "father" | "grandparent" | "other";
    createdAt: number;
};

const parentsCol = collection(db, "parents");

export const createParent = async (data: ParentDoc) => {
    const docRef = await addDoc(parentsCol, data);
    return docRef.id;
};

export const getParent = async (id: string) => {
    const snap = await getDoc(doc(db, "parents", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as ParentDoc) };
};

export const getAllParents = async () => {
    const snap = await getDocs(parentsCol);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ParentDoc)}));
};

export const updateParent = async (id: string, data: Partial<ParentDoc>) => {
    const parentRef = doc(db, "parents", id);
    await updateDoc(parentRef, data);
};

export const deleteParent = async (id: string) => {
    const parentRef = doc(db, "parents", id);
    await deleteDoc(parentRef);
}; */

// @/api/parents.ts
import { db } from "@/firebaseConfig";
import { ParentProps } from "@/types/parent";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const parentsCol = collection(db, "parents");

export const createParent = async (data: Omit<ParentProps, "id">) => {
  const docRef = await addDoc(parentsCol, data);
  return docRef.id;
};

export const getParent = async (id: string): Promise<ParentProps | null> => {
  const snap = await getDoc(doc(db, "parents", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<ParentProps, "id">),
  };
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

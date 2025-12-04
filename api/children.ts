import { db } from "@/firebaseConfig";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from "firebase/firestore";

export type ChildDoc = {
    name: string;
    groupName?: string;
    parentIds: string[];
    createdAt: number;
};

const childrenCol = collection(db, "children");

export const createChild = async (data: ChildDoc) => {
    const docRef = await addDoc(childrenCol, data);
    return docRef.id;
};

export const getChild = async (id: string) => {
    const snap = await getDoc(doc(db, "children", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as ChildDoc) };
};

export const getAllChildren = async () => {
    const snap = await getDocs(childrenCol);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ChildDoc) }));
};

export const getChildrenForParent = async (parentId: string) => {
    const q = query(childrenCol, where("parentIds", "array-contains", parentId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ChildDoc) }));
};

export const updateChild = async (id: string, data: Partial<ChildDoc>) => {
    const childRef = doc(db, "children", id);
    await updateDoc(childRef, data);
};

export const deleteChild = async (id: string) => {
    const childRef = doc(db, "children", id);
    await deleteDoc(childRef);
};
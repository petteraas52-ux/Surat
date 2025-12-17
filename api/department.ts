import { db } from "@/firebaseConfig";
import { DepartmentProps } from "@/types/department";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const departmentsCol = collection(db, "departments");

export const createDepartment = async (name: string): Promise<string> => {
  const docRef = await addDoc(departmentsCol, {
    name: name,
  });
  return docRef.id;
};

export const getDepartment = async (
  id: string
): Promise<DepartmentProps | null> => {
  const snap = await getDoc(doc(db, "departments", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as { name: string }),
  };
};

export const getAllDepartments = async (): Promise<DepartmentProps[]> => {
  const snap = await getDocs(departmentsCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { name: string }),
  }));
};

export const updateDepartment = async (
  id: string,
  data: Partial<Omit<DepartmentProps, "id">>
) => {
  const deptRef = doc(db, "departments", id);
  await updateDoc(deptRef, data);
};

export const deleteDepartment = async (id: string) => {
  const deptRef = doc(db, "departments", id);
  await deleteDoc(deptRef);
};

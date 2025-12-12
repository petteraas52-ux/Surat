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
  where,
} from "firebase/firestore";

export type EmployeeDoc = {
  name: string;
  role?: string;
  email?: string;
  phoneNumber?: string;
  groupName?: string;
  createdAt: number;
};

const employeesCol = collection(db, "emplyees");

export const createEmployee = async (data: EmployeeDoc) => {
  const docRef = await addDoc(employeesCol, data);
  return docRef.id;
};

export const getEmployee = async (id: string) => {
  const snap = await getDoc(doc(db, "employees", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as EmployeeDoc) };
};

export const getAllEmployees = async () => {
  const snap = await getDocs(employeesCol);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as EmployeeDoc) }));
};

export const getEmployeesForGroup = async (groupName: string) => {
  const q = query(employeesCol, where("groupName", "==", groupName));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as EmployeeDoc) }));
};

export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeDoc>
) => {
  const employeeRef = doc(db, "employees", id);
  await updateDoc(employeeRef, data);
};

export const deleteEmployee = async (id: string) => {
  const employeeRef = doc(db, "employees", id);
  await deleteDoc(employeeRef);
};

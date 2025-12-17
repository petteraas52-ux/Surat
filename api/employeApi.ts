import { auth, db } from "@/firebaseConfig";
import { EmployeeProps } from "@/types/employeeData";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

const employeesCol = collection(db, "employees");

export const createEmployee = async (
  email: string,
  temporaryPassword: string,
  data: Omit<EmployeeProps, "id">
): Promise<string> => {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    email,
    temporaryPassword
  );

  const uid = user.uid;

  await setDoc(doc(db, "employees", uid), {
    ...data,
    eMail: email,
  });

  return uid;
};

export const getEmployee = async (
  id: string
): Promise<EmployeeProps | null> => {
  const snap = await getDoc(doc(db, "employees", id));
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<EmployeeProps, "id">),
  };
};

export const getAllEmployees = async (): Promise<EmployeeProps[]> => {
  const snap = await getDocs(employeesCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<EmployeeProps, "id">),
  }));
};

export const updateEmployee = async (
  id: string,
  data: Partial<Omit<EmployeeProps, "id">>
) => {
  const employeeRef = doc(db, "employees", id);
  await updateDoc(employeeRef, data);
};

export const deleteEmployee = async (id: string) => {
  const employeeRef = doc(db, "employees", id);
  await deleteDoc(employeeRef);
};

export const updateEmployeeProfileImage = async (
  employeeId: string,
  imageUri: string
): Promise<boolean> => {
  try {
    const storagePath = await uploadImageToFirebase(imageUri);
    if (!storagePath) return false;

    await updateEmployee(employeeId, { imageUri: storagePath });
    console.log("Employee profile image updated successfully");
    return true;
  } catch (e) {
    console.error("Error updating employee profile image:", e);
    return false;
  }
};

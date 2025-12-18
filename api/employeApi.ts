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

/**
 * Employees Collection Reference
 * Stores profile data, roles, and department assignments for staff members.
 */
const employeesCol = collection(db, "employees");

/**
 * CREATE EMPLOYEE (Two-Step Process)
 * CRUCIAL LOGIC:
 * 1. Creates a login credential in Firebase Authentication.
 * 2. Uses the resulting 'uid' to create a matching document in Firestore.
 * * WHY SETDOC? We use 'setDoc' instead of 'addDoc' because we want the
 * Firestore Document ID to exactly match the Auth UID. This makes
 * cross-referencing user data and writing Security Rules much easier.
 */
export const createEmployee = async (
  email: string,
  temporaryPassword: string,
  data: Omit<EmployeeProps, "id">
): Promise<string> => {
  // Step 1: Create Auth Entry
  const { user } = await createUserWithEmailAndPassword(
    auth,
    email,
    temporaryPassword
  );

  const uid = user.uid;

  // Step 2: Create Data Entry with matching ID
  await setDoc(doc(db, "employees", uid), {
    ...data,
    eMail: email,
  });

  return uid;
};

/**
 * GET SINGLE EMPLOYEE
 * Retrieves staff details by their Unique ID (UID).
 */
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

/**
 * GET ALL EMPLOYEES
 * Used for admin staff lists and assigning teachers to departments.
 */
export const getAllEmployees = async (): Promise<EmployeeProps[]> => {
  const snap = await getDocs(employeesCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<EmployeeProps, "id">),
  }));
};

/**
 * UPDATE EMPLOYEE
 * Partial update logic allowing specific field changes (like phone or role)
 * without overwriting the entire profile document.
 */
export const updateEmployee = async (
  id: string,
  data: Partial<Omit<EmployeeProps, "id">>
) => {
  const employeeRef = doc(db, "employees", id);
  await updateDoc(employeeRef, data);
};

/**
 * DELETE EMPLOYEE
 * Note: This only deletes the Firestore data document.
 * To fully remove an employee, they would also need to be deleted from Firebase Auth.
 */
export const deleteEmployee = async (id: string) => {
  const employeeRef = doc(db, "employees", id);
  await deleteDoc(employeeRef);
};

/**
 * UPDATE EMPLOYEE PROFILE IMAGE
 * WORKFLOW:
 * 1. Uploads file to Firebase Storage via 'uploadImageToFirebase'.
 * 2. Updates the employee's Firestore document with the returned storage path/URL.
 */
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

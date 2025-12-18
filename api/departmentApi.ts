import { db } from "@/firebaseConfig";
import { DepartmentProps } from "@/types/departmentData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

/**
 * DEPARTMENTS COLLECTION
 * This collection acts as a lookup table for the different groups or rooms in the kindergarten.
 * Other documents (Children, Employees, Events) reference these department names
 * to organize data and filter views.
 */
const departmentsCol = collection(db, "departments");

/**
 * CREATE DEPARTMENT
 * Adds a new group/room to the system.
 * @param name - The human-readable name of the department (e.g., "Solstua").
 */
export const createDepartment = async (name: string): Promise<string> => {
  const docRef = await addDoc(departmentsCol, {
    name: name,
  });
  return docRef.id;
};

/**
 * GET SINGLE DEPARTMENT
 * Fetches specific metadata for one department.
 */
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

/**
 * GET ALL DEPARTMENTS
 * CRUCIAL: Used globally to populate DropDownPickers throughout the app.
 * Keeping this list centralized ensures consistency across all user roles.
 */
export const getAllDepartments = async (): Promise<DepartmentProps[]> => {
  const snap = await getDocs(departmentsCol);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { name: string }),
  }));
};

/**
 * UPDATE DEPARTMENT
 * Allows an admin to rename a department.
 * Note: If a name is changed here, existing children/employees with the old name
 * in their 'department' field will need to be updated to match.
 */
export const updateDepartment = async (
  id: string,
  data: Partial<Omit<DepartmentProps, "id">>
) => {
  const deptRef = doc(db, "departments", id);
  await updateDoc(deptRef, data);
};

/**
 * DELETE DEPARTMENT
 * Standard deletion.
 * Admin Caution: Ensure no children are currently assigned to this department
 * before deleting, or they will become "orphaned" in the UI.
 */
export const deleteDepartment = async (id: string) => {
  const deptRef = doc(db, "departments", id);
  await deleteDoc(deptRef);
};

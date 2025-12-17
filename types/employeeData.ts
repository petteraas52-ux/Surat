export interface EmployeeProps {
  id: string;
  firstName: string;
  lastName: string;
  eMail: string;
  phone: string;
  imageUri: string;
  department: string;
  role: "admin" | "employee";
}

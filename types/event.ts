import { Timestamp } from "firebase/firestore";

export interface EventProps {
  id: string;
  date: Timestamp;
  title: string;
  department: string;
  description: string;
}

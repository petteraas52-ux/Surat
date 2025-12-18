import { Timestamp } from "firebase/firestore";

export interface Comment {
    id?: string;
    childId: string;
    createdById: string; 
    createdByName: string; 
    text: string;
    createdAt?: Timestamp; 
}
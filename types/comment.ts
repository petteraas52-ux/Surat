import { Timestamp } from "firebase/firestore";

export interface Comment {
    id?: string;
    childId: string;
    createdById: string; // skrevet av ansatt eller forelder?
    createdByName: string; // navn på hvem som har skrevet kommentar (innlogget bruker)
    text: string;
    createdAt?: Timestamp; 
}
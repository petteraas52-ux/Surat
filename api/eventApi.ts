import { db } from "@/firebaseConfig";
import { EventProps } from "@/types/eventData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

/**
 * Events Collection Reference
 * Used for school-wide or department-specific announcements and calendar items.
 */
const eventsCol = collection(db, "events");

/**
 * CREATE EVENT
 * CRUCIAL LOGIC: Date Conversion.
 * Firestore stores dates as 'Timestamps' (seconds + nanoseconds).
 * This logic ensures that whether the frontend sends a JS Date or a Firestore Timestamp,
 * it is correctly stored in the database format.
 */
export const createEvent = async (data: Omit<EventProps, "id">) => {
  const docRef = await addDoc(eventsCol, {
    ...data,
    date:
      data.date instanceof Timestamp
        ? data.date
        : Timestamp.fromDate(data.date), // Normalizes JS Date to Firestore Timestamp
  });
  return docRef.id;
};

/**
 * GET SINGLE EVENT
 * Explicit Mapping: When retrieving data, we explicitly cast the date field
 * as a Timestamp. This allows the frontend to use methods like .toDate() or .toLocaleDateString().
 */
export const getEvent = async (id: string): Promise<EventProps | null> => {
  const snap = await getDoc(doc(db, "events", id));
  if (!snap.exists()) return null;

  const docData = snap.data();
  return {
    id: snap.id,
    title: docData.title,
    department: docData.department,
    description: docData.description,
    date: docData.date as Timestamp,
  } as EventProps;
};

/**
 * GET ALL EVENTS
 * Fetches the list of all calendar events.
 * Developer Note: For production, you would likely want to add an 'orderBy' query
 * to sort events by date.
 */
export const getAllEvents = async (): Promise<EventProps[]> => {
  const snap = await getDocs(eventsCol);
  return snap.docs.map((d) => {
    const docData = d.data();
    return {
      id: d.id,
      title: docData.title,
      department: docData.department,
      description: docData.description,
      date: docData.date as Timestamp,
    } as EventProps;
  });
};

/**
 * UPDATE EVENT
 * CRUCIAL LOGIC: Partial Timestamp Handling.
 * If the user updates the date field, we must ensure it is re-normalized to
 * a Firestore Timestamp before sending the update request.
 */
export const updateEvent = async (
  id: string,
  data: Partial<Omit<EventProps, "id">>
) => {
  const eventRef = doc(db, "events", id);
  const updatedData: any = { ...data };

  if (data.date) {
    updatedData.date =
      data.date instanceof Timestamp
        ? data.date
        : Timestamp.fromDate(data.date);
  }

  await updateDoc(eventRef, updatedData);
};

/**
 * DELETE EVENT
 * Standard document removal by ID.
 */
export const deleteEvent = async (id: string) => {
  const eventRef = doc(db, "events", id);
  await deleteDoc(eventRef);
};

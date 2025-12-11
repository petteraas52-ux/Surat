import { db } from "@/firebaseConfig";
import { EventProps } from "@/types/event";
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

const eventsCol = collection(db, "events");

export const createEvent = async (data: Omit<EventProps, "id">) => {
  const docRef = await addDoc(eventsCol, {
    ...data,
    date:
      data.date instanceof Timestamp
        ? data.date
        : Timestamp.fromDate(data.date),
  });
  return docRef.id;
};

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

export const deleteEvent = async (id: string) => {
  const eventRef = doc(db, "events", id);
  await deleteDoc(eventRef);
};

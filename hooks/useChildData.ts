import { getAllEvents } from "@/api/event";
import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/child";
import { EventProps } from "@/types/event";
import { getErrorMessage } from "@/utils/error";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

type AbsenceType = "sykdom" | "ferie" | null;

export type UIChild = ChildProps & {
  selected?: boolean;
  absenceType?: AbsenceType;
  absenceFrom?: string | null;
  absenceTo?: string | null;
};

export const useChildData = () => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [children, setChildren] = useState<UIChild[]>([]);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const loadChildren = async () => {
      try {
        const childrenCol = collection(db, "children");
        const q = query(childrenCol, where("parents", "array-contains", uid));
        const snap = await getDocs(q);

        const data: UIChild[] = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChildProps, "id">),
          selected: false,
          absenceType: null,
          absenceFrom: null,
          absenceTo: null,
        }));

        setChildren(data);
      } catch (err) {
        console.error("Failed to load children:", err);
        setErrorMessage(getErrorMessage("children", "LOAD_FAILED"));
      }
    };

    const loadEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
        setErrorMessage(getErrorMessage("events", "LOAD_FAILED"));
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
    loadEvents();
  }, [uid]);

  const toggleSelect = (id: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  return {
    children,
    setChildren,
    events,
    loading,
    toggleSelect,
    uid,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
};

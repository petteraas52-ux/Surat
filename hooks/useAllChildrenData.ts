import { getAllEvents } from "@/api/event";
import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/child";
import { EventProps } from "@/types/event";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type AbsenceType = "sykdom" | "ferie" | null;

export type UIChild = ChildProps & {
  selected?: boolean;
  absenceType?: AbsenceType;
  absenceFrom?: string | null;
  absenceTo?: string | null;
};

export const useAllChildrenData = () => {
  const [children, setChildren] = useState<UIChild[]>([]);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const childrenCol = collection(db, "children");
        const snap = await getDocs(childrenCol);
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
      }
    };

    const loadEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
    loadEvents();
  }, []);

  const toggleSelect = (id: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  return { children, setChildren, events, loading, toggleSelect };
};
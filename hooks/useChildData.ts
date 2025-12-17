import { getAllEvents } from "@/api/eventApi";
import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import { EventProps } from "@/types/eventData";
import { getErrorMessage } from "@/utils/error";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = useCallback(
    async (isManual = false) => {
      if (!uid) return;

      console.log(`[useChildData] Fetching data... (Manual: ${isManual})`);
      if (!isManual) setLoading(true);

      try {
        const childrenCol = collection(db, "children");
        const q = query(childrenCol, where("parents", "array-contains", uid));

        const [childSnap, eventsData] = await Promise.all([
          getDocs(q),
          getAllEvents(),
        ]);

        const childList: UIChild[] = childSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChildProps, "id">),
          selected: false,
          absenceType: (docSnap.data() as any).absenceType || null,
          absenceFrom: (docSnap.data() as any).absenceFrom || null,
          absenceTo: (docSnap.data() as any).absenceTo || null,
        }));

        setChildren(childList);
        setEvents(eventsData);
        setLastUpdated(new Date());
        setErrorMessage(null);
        console.log(
          `[useChildData] Fetch complete at ${new Date().toLocaleTimeString()}`
        );
      } catch (err) {
        console.error("[useChildData] Fetch error:", err);
        setErrorMessage(getErrorMessage("children", "LOAD_FAILED"));
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
    lastUpdated,
    refreshData: () => refreshData(true),
    clearError: () => setErrorMessage(null),
  };
};

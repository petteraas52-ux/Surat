import { getAllEvents } from "@/api/eventApi";
import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import { EventProps } from "@/types/eventData";
import { getErrorMessage } from "@/utils/error";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const toggleSelect = useCallback((childId: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, selected: !c.selected } : c))
    );
  }, []);

  const refreshData = useCallback(
    async (isManual = false) => {
      if (!uid) return;

      if (!isManual && children.length === 0) setLoading(true);

      try {
        const employeeDoc = await getDoc(doc(db, "employees", uid));
        const isStaff = employeeDoc.exists();

        const childrenCol = collection(db, "children");
        const q = isStaff
          ? query(childrenCol)
          : query(childrenCol, where("parents", "array-contains", uid));

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
      } catch (err) {
        console.error("[useChildData] Fetch error:", err);
        setErrorMessage(getErrorMessage("children", "LOAD_FAILED"));
      } finally {
        setLoading(false);
      }
    },
    [uid, children.length]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    children,
    setChildren,
    events,
    loading,
    toggleSelect,
    errorMessage,
    clearError,
    lastUpdated,
    refreshData: () => {
      setErrorMessage(null);
      refreshData(true);
    },
  };
};

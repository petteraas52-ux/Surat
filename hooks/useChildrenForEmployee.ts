import { auth, db } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import { collection, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type AbsenceType = "sykdom" | "ferie" | null;

export type UIChild = ChildProps & {
  selected?: boolean;
  absenceType?: AbsenceType;
  absenceFrom?: string | null;
  absenceTo?: string | null;
};

export const useChildrenForEmployee = () => {
  const [children, setChildren] = useState<UIChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const uid = auth.currentUser?.uid;

  const fetchChildren = useCallback(
    async (isManual = false) => {
      if (!uid) return;

      if (isManual || children.length === 0) {
        setLoading(true);
      }

      try {
        const q = query(collection(db, "children"));
        const snap = await getDocs(q);

        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChildProps, "id">),
          selected: false,
          absenceType: (docSnap.data() as any).absenceType || null,
          absenceFrom: (docSnap.data() as any).absenceFrom || null,
          absenceTo: (docSnap.data() as any).absenceTo || null,
        })) as UIChild[];

        setChildren(list);
        setError(null);
      } catch (e) {
        console.error("[useChildrenForEmployee] Error:", e);
        setError("LOAD_FAILED");
      } finally {
        setLoading(false);
      }
    },
    [uid, children.length]
  );

  const toggleSelect = useCallback((id: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  }, []);

  const refreshData = useCallback(async () => {
    setError(null);
    await fetchChildren(true);
  }, [fetchChildren]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    setChildren,
    loading,
    error,
    toggleSelect,
    refreshData,
  };
};

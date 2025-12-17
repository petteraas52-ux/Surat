import { getAllChildren } from "@/api/childrenApi";
import { auth } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const fetchedRef = useRef(false);

  const fetchChildren = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh && fetchedRef.current) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        setChildren([]);
        return;
      }

      const childrenData = await getAllChildren();

      const uiChildren: UIChild[] = childrenData.map((c) => ({
        ...c,
        selected: false,
        absenceType: (c as any).absenceType || null,
        absenceFrom: (c as any).absenceFrom || null,
        absenceTo: (c as any).absenceTo || null,
      }));

      setChildren(uiChildren);
      fetchedRef.current = true;
    } catch (err) {
      console.error("Failed to load children:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const toggleSelect = (id: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  return {
    children,
    loading,
    toggleSelect,
    setChildren,
    refreshData: () => fetchChildren(true),
  };
};

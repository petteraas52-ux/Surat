import { getAllChildren } from "@/api/children";
import { auth } from "@/firebaseConfig";
import { ChildProps } from "@/types/child";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (fetchedRef.current) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchChildren = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          if (isMounted) setChildren([]);
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

        if (isMounted) {
          setChildren(uiChildren);
          fetchedRef.current = true;
        }
      } catch (err) {
        console.error("Failed to load all children:", err);
        if (isMounted) setChildren([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChildren();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSelect = (id: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  return { children, loading, toggleSelect, setChildren };
};

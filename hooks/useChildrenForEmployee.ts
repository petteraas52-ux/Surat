import { getChildrenForDepartment } from "@/api/children";
import { getEmployee } from "@/api/employees";
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

  // Ref for å unngå dobbeltfetch hvis hook kjører flere ganger
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) {
      setLoading(false); // data er allerede hentet
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

        const employee = await getEmployee(user.uid);
        if (!employee) {
          if (isMounted) setChildren([]);
          return;
        }

        const childrenData = await getChildrenForDepartment(employee.department);
        const uiChildren: UIChild[] = childrenData.map((c) => ({
          ...c,
          selected: false,
          absenceType: null,
          absenceFrom: null,
          absenceTo: null,
        }));

        if (isMounted) setChildren(uiChildren);
        fetchedRef.current = true; // mark as fetched
      } catch (err) {
        console.error("Failed to load children for employee:", err);
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

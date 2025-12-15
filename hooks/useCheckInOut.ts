import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { UIChild } from "./useChildData";
import { useI18n } from "./useI18n";

interface UseCheckInOutProps {
  children: UIChild[];
  setChildren: React.Dispatch<React.SetStateAction<UIChild[]>>;
}

export const useCheckInOut = ({
  children,
  setChildren,
}: UseCheckInOutProps) => {
  const anySelected = children.some((c) => c.selected);
  const { t } = useI18n();

  const getButtonText = (): string => {
    const selected = children.filter((c) => c.selected);
    
    if (selected.length === 0) return t("choseChildrenButtonText");

    const allCheckedIn = selected.every((c) => c.checkedIn);
    const allCheckedOut = selected.every((c) => !c.checkedIn);

    if (allCheckedIn) return t("checkOut");
    if (allCheckedOut) return t("checkIn");
    return t("updateStatusText");
  };

  const applyCheckInOut = async () => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return;

    const allCheckedIn = selected.every((c) => c.checkedIn);
    const newCheckedIn = !allCheckedIn;

    const updatedChildren = children.map((child) =>
      child.selected
        ? {
            ...child,
            checkedIn: newCheckedIn,
            selected: false,
            ...(newCheckedIn
              ? { absenceType: null, absenceFrom: null, absenceTo: null }
              : {}),
          }
        : child
    );
    setChildren(updatedChildren);

    for (const child of selected) {
      await updateDoc(doc(db, "children", child.id), {
        checkedIn: newCheckedIn,
      });
    }
  };

  const toggleOverlayChildCheckIn = async (childId: string | null) => {
    if (!childId) return;

    const child = children.find((c) => c.id === childId);
    if (!child) return;

    const newStatus = !child.checkedIn;

    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId
          ? {
              ...c,
              checkedIn: newStatus,
              ...(newStatus
                ? { absenceType: null, absenceFrom: null, absenceTo: null }
                : {}),
            }
          : c
      )
    );

    await updateDoc(doc(db, "children", childId), {
      checkedIn: newStatus,
    });
  };

  return {
    anySelected,
    getButtonText,
    applyCheckInOut,
    toggleOverlayChildCheckIn,
  };
};

import { db } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { UIChild } from "./useChildData";

interface UseCheckInOutProps {
  children: UIChild[];
  setChildren: React.Dispatch<React.SetStateAction<UIChild[]>>;
}

export const useCheckInOut = ({
  children,
  setChildren,
}: UseCheckInOutProps) => {
  const anySelected = children.some((c) => c.selected);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getButtonText = (): string => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return "Velg barn";

    const allCheckedIn = selected.every((c) => c.checkedIn);
    const allCheckedOut = selected.every((c) => !c.checkedIn);

    if (allCheckedIn) return "Sjekk ut";
    if (allCheckedOut) return "Sjekk inn";
    return "Oppdater status";
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
    try {
      for (const child of selected) {
        await updateDoc(doc(db, "children", child.id), {
          checkedIn: newCheckedIn,
        });
      }
    } catch (err) {
      console.error("Failed to update check-in/out:", err);
      setErrorMessage(getErrorMessage("general", "SERVER"));
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

    try {
      await updateDoc(doc(db, "children", childId), {
        checkedIn: newStatus,
      });
    } catch (err) {
      console.error("Failed to update single check-in/out:", err);
      setErrorMessage(getErrorMessage("general", "SERVER"));
    }
  };

  return {
    anySelected,
    getButtonText,
    applyCheckInOut,
    toggleOverlayChildCheckIn,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
};

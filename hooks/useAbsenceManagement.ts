import { db } from "@/firebaseConfig";
import { addDays, formatDateShort, getTodayStr } from "@/utils/date";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { UIChild } from "./useChildData";

type AbsenceType = "sykdom" | "ferie" | null;

interface UseAbsenceManagementProps {
  children: UIChild[];
  setChildren: React.Dispatch<React.SetStateAction<UIChild[]>>;
}

export const useAbsenceManagement = ({
  children,
  setChildren,
}: UseAbsenceManagementProps) => {
  const [absenceModalVisible, setAbsenceModalVisible] = useState(false);
  const [vacationDays, setVacationDays] = useState<number>(7);

  const anySelected = children.some((c) => c.selected);

  const openAbsenceModal = () => {
    if (!anySelected) return;
    setAbsenceModalVisible(true);
  };

  const closeAbsenceModal = () => {
    setAbsenceModalVisible(false);
  };

  const getAbsenceLabel = (child: UIChild) => {
    if (!child.absenceType || !child.absenceFrom || !child.absenceTo) {
      return null;
    }

    const fromStr = formatDateShort(child.absenceFrom);
    const toStr = formatDateShort(child.absenceTo);
    const type = child.absenceType;

    if (child.absenceFrom === child.absenceTo) {
      if (type === "sykdom") return `Syk i dag (${fromStr})`;
      if (type === "ferie") return `Ferie (${fromStr})`;
    }

    if (type === "sykdom") return `Syk ${fromStr}–${toStr}`;
    return `Ferie ${fromStr}–${toStr}`;
  };

  const registerSicknessTodayForSelected = async () => {
    if (!anySelected) return;
    const today = getTodayStr();
    const selectedChildren = children.filter((c) => c.selected);

    setChildren((prev) =>
      prev.map((child) =>
        child.selected
          ? {
              ...child,
              absenceType: "sykdom" as AbsenceType,
              absenceFrom: today,
              absenceTo: today,
              checkedIn: false,
              selected: false,
            }
          : child
      )
    );

    for (const child of selectedChildren) {
      const absRef = collection(db, "children", child.id, "absences");
      await addDoc(absRef, {
        type: "sykdom",
        from: today,
        to: today,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "children", child.id), {
        checkedIn: false,
      });
    }

    setAbsenceModalVisible(false);
  };

  const registerVacationForSelected = async () => {
    if (!anySelected) return;

    const start = getTodayStr();
    const end = addDays(start, Math.max(1, vacationDays) - 1);
    const selectedChildren = children.filter((c) => c.selected);

    setChildren((prev) =>
      prev.map((child) =>
        child.selected
          ? {
              ...child,
              absenceType: "ferie" as AbsenceType,
              absenceFrom: start,
              absenceTo: end,
              checkedIn: false,
              selected: false,
            }
          : child
      )
    );

    for (const child of selectedChildren) {
      const absRef = collection(db, "children", child.id, "absences");
      await addDoc(absRef, {
        type: "ferie",
        from: start,
        to: end,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "children", child.id), {
        checkedIn: false,
      });
    }

    setAbsenceModalVisible(false);
  };

  return {
    absenceModalVisible,
    setAbsenceModalVisible,
    vacationDays,
    setVacationDays,
    anySelected,
    getAbsenceLabel,
    openAbsenceModal,
    closeAbsenceModal,
    registerSicknessTodayForSelected,
    registerVacationForSelected,
  };
};

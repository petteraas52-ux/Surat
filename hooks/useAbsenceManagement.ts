/**
 * USE ABSENCE MANAGEMENT HOOK
 * * ROLE:
 * Manages the logic for marking children as absent (sickness or vacation).
 * * CORE FUNCTIONALITY:
 * 1. Optimistic UI Updates: Updates the local 'children' state immediately so
 * the UI feels responsive while the database write happens in the background.
 * 2. Multi-Record Database Writes: Creates a log in the 'absences' sub-collection
 * for history while simultaneously updating the main child document status.
 * 3. Date Arithmetic: Handles the conversion of vacation duration (days) into
 * specific end-date strings.
 */

import { db } from "@/firebaseConfig";
import { addDays, formatDateShort, getTodayStr } from "@/utils/date";
import { getErrorMessage } from "@/utils/error";
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
  // --- STATE ---
  const [absenceModalVisible, setAbsenceModalVisible] = useState(false);
  const [vacationDays, setVacationDays] = useState<number>(7);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [vacationStartDate, setVacationStartDate] = useState<string>(
    getTodayStr()
  );

  // Helper to check if any children are currently checked/selected in the list
  const anySelected = children.some((c) => c.selected);

  // --- MODAL CONTROLS ---
  const openAbsenceModal = () => {
    if (!anySelected && !absenceModalVisible) return;
    setAbsenceModalVisible(true);
  };

  const closeAbsenceModal = () => {
    setAbsenceModalVisible(false);
  };

  /**
   * getAbsenceLabel
   * Returns a localized string describing the absence (e.g., "Syk 12.05-14.05")
   * used to display status directly on the ChildCard.
   */
  const getAbsenceLabel = (child: UIChild) => {
    if (!child.absenceType || !child.absenceFrom || !child.absenceTo) {
      return null;
    }

    const fromStr = formatDateShort(child.absenceFrom);
    const toStr = formatDateShort(child.absenceTo);
    const type = child.absenceType;

    // Handle single-day absences
    if (child.absenceFrom === child.absenceTo) {
      if (type === "sykdom") return `Syk i dag (${fromStr})`;
      if (type === "ferie") return `Ferie (${fromStr})`;
    }

    // Handle date ranges
    if (type === "sykdom") return `Syk ${fromStr}–${toStr}`;
    return `Ferie ${fromStr}–${toStr}`;
  };

  /**
   * registerSicknessTodayForSelected
   * Marks all selected children as sick for the current date.
   */
  const registerSicknessTodayForSelected = async () => {
    if (!anySelected) return;
    const today = getTodayStr();
    const selectedChildren = children.filter((c) => c.selected);

    // 1. OPTIMISTIC UPDATE: Update local state immediately for instant feedback
    setChildren((prev) =>
      prev.map((child) =>
        child.selected
          ? {
              ...child,
              absenceType: "sykdom" as AbsenceType,
              absenceFrom: today,
              absenceTo: today,
              checkedIn: false, // Ensure they are checked out if marked sick
              selected: false, // Reset selection
            }
          : child
      )
    );

    try {
      // 2. DATABASE PERSISTENCE: Loop through selected children to update Firestore
      for (const child of selectedChildren) {
        // Create an entry in the history sub-collection
        const absRef = collection(db, "children", child.id, "absences");
        await addDoc(absRef, {
          type: "sykdom",
          from: today,
          to: today,
          createdAt: serverTimestamp(),
        });

        // Update the child's main document status
        await updateDoc(doc(db, "children", child.id), {
          checkedIn: false,
        });
      }

      setAbsenceModalVisible(false);
    } catch (err) {
      console.error("Failed to register sickness:", err);
      setErrorMessage(getErrorMessage("absence", "CREATE_FAILED"));
    }
  };

  /**
   * registerVacationForSelected
   * Calculates a date range based on start date and duration, then updates Firestore.
   */
  const registerVacationForSelected = async () => {
    if (!anySelected) return;

    const start = vacationStartDate;
    // Calculate end date based on the number of days selected in the slider/input
    const end = addDays(start, Math.max(1, vacationDays) - 1);
    const selectedChildren = children.filter((c) => c.selected);

    // 1. OPTIMISTIC UPDATE
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

    try {
      // 2. DATABASE PERSISTENCE
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
    } catch (err) {
      console.error("Failed to register vacation:", err);
      setErrorMessage(getErrorMessage("absence", "CREATE_FAILED"));
    }
  };

  return {
    // UI State
    absenceModalVisible,
    setAbsenceModalVisible,
    vacationDays,
    setVacationDays,
    vacationStartDate,
    setVacationStartDate,
    anySelected,

    // Logic Functions
    getAbsenceLabel,
    openAbsenceModal,
    closeAbsenceModal,
    registerSicknessTodayForSelected,
    registerVacationForSelected,

    // Error Handling
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
};

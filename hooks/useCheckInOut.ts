/**
 * USE CHECK IN/OUT HOOK
 * * ROLE:
 * Manages the core attendance logic for checking children in and out of the facility.
 * * CORE FUNCTIONALITY:
 * 1. Multi-Select Actions: Determines if a group of children should be checked
 * in or out based on their current collective state.
 * 2. Absence Reset: Automatically clears any absence markers (sick/vacation)
 * when a child is checked in, as physical presence overrides absence logs.
 * 3. Optimistic Local State: Updates the 'children' state immediately for a
 * lag-free UI, then persists the changes to Firestore.
 */

import { db } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useI18n();

  /**
   * getButtonText
   * Dynamically calculates the label for the main action button based on
   * the 'checkedIn' status of the selected subset.
   */
  const getButtonText = (): string => {
    const selected = children.filter((c) => c.selected);

    // No children selected
    if (selected.length === 0) return t("choseChildrenButtonText");

    const allCheckedIn = selected.every((c) => c.checkedIn);
    const allCheckedOut = selected.every((c) => !c.checkedIn);

    // Context-aware labels
    if (allCheckedIn) return t("checkOut");
    if (allCheckedOut) return t("checkIn");

    // Mixed state (some in, some out)
    return t("updateStatusText");
  };

  /**
   * applyCheckInOut
   * Processes a bulk update for all currently selected children.
   */
  const applyCheckInOut = async () => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return;

    // If all are in, we check them out. Otherwise (mixed or all out), we check them in.
    const allCheckedIn = selected.every((c) => c.checkedIn);
    const newCheckedIn = !allCheckedIn;

    // 1. OPTIMISTIC UPDATE: Map through the list and update the local state
    const updatedChildren = children.map((child) =>
      child.selected
        ? {
            ...child,
            checkedIn: newCheckedIn,
            selected: false, // Deselect after action
            // CRITICAL: If checking in, remove existing absence labels
            ...(newCheckedIn
              ? { absenceType: null, absenceFrom: null, absenceTo: null }
              : {}),
          }
        : child
    );

    setChildren(updatedChildren);

    try {
      // 2. PERSISTENCE: Sequential updates to Firestore
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

  /**
   * toggleOverlayChildCheckIn
   * Handles a status toggle for a single child, typically triggered
   * from a Detail Modal or Profile Overlay.
   */
  const toggleOverlayChildCheckIn = async (childId: string | null) => {
    if (!childId) return;

    const child = children.find((c) => c.id === childId);
    if (!child) return;

    const newStatus = !child.checkedIn;

    // 1. OPTIMISTIC UPDATE
    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId
          ? {
              ...c,
              checkedIn: newStatus,
              // Clear absence data if status becomes 'Checked In'
              ...(newStatus
                ? { absenceType: null, absenceFrom: null, absenceTo: null }
                : {}),
            }
          : c
      )
    );

    try {
      // 2. PERSISTENCE
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

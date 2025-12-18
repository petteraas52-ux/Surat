/**
 * USE CHILD DATA HOOK
 * * ROLE:
 * The central data engine for the application. Fetches both children and events,
 * and handles permission-based queries (Staff vs. Parent).
 * * CORE FUNCTIONALITY:
 * 1. Role-Based Access: Detects if the user is an 'employee' to either fetch
 * ALL children or only those linked to the logged-in parent.
 * 2. State Enrichment: Extends basic 'ChildProps' with UI-specific properties
 * like 'selected' and 'absence' tracking.
 * 3. Parallel Fetching: Uses Promise.all to fetch children and calendar events
 * simultaneously, reducing total load time.
 * 4. Refresh Logic: Supports both automatic mounting and manual "pull-to-refresh"
 * triggers while managing global loading and error states.
 */

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

// UIChild extends the database model with transient UI states (like selection)
export type UIChild = ChildProps & {
  selected?: boolean;
  absenceType?: AbsenceType;
  absenceFrom?: string | null;
  absenceTo?: string | null;
};

export const useChildData = () => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // --- STATE ---
  const [children, setChildren] = useState<UIChild[]>([]);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /**
   * clearError
   * Resets the error state, typically called when a user closes an error alert.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * toggleSelect
   * Manages local UI selection state (e.g., for bulk checking in children).
   */
  const toggleSelect = useCallback((childId: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, selected: !c.selected } : c))
    );
  }, []);

  /**
   * refreshData
   * The primary fetcher. Determines user role and queries Firestore accordingly.
   */
  const refreshData = useCallback(
    async (isManual = false) => {
      if (!uid) return;

      // Only show the primary loading spinner if it's the first load
      if (!isManual && children.length === 0) setLoading(true);

      try {
        // 1. Check if user exists in the employees collection (Admin/Staff check)
        const employeeDoc = await getDoc(doc(db, "employees", uid));
        const isStaff = employeeDoc.exists();

        const childrenCol = collection(db, "children");

        // 2. Define Query: Staff see everyone; Parents only see their linked children
        const q = isStaff
          ? query(childrenCol)
          : query(childrenCol, where("parents", "array-contains", uid));

        // 3. Parallel Execution: Fetch children and events together
        const [childSnap, eventsData] = await Promise.all([
          getDocs(q),
          getAllEvents(),
        ]);

        // 4. Data Transformation: Map Firestore docs into UIChild objects
        const childList: UIChild[] = childSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChildProps, "id">),
          selected: false, // Default selection state
          // Ensure absence fields have safe fallbacks
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

  // Initial fetch on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Data
    children,
    setChildren,
    events,

    // UI State
    loading,
    errorMessage,
    lastUpdated,

    // Methods
    toggleSelect,
    clearError,
    refreshData: () => {
      setErrorMessage(null);
      refreshData(true);
    },
  };
};

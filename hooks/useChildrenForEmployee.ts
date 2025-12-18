/**
 * USE CHILDREN FOR EMPLOYEE HOOK
 * * ROLE:
 * A specialized data fetcher for staff/admin users. Unlike the general useChildData,
 * this hook is optimized for the employee view where access to all children is required.
 * * CORE FUNCTIONALITY:
 * 1. Admin-Level Fetching: Queries the entire 'children' collection without filtering
 * by parent ID, assuming the user has already been authenticated as an employee.
 * 2. Extended UI State: Maps raw Firestore documents into UIChild objects,
 * initializing selection states and absence fields.
 * 3. Loading Orchestration: Manages conditional loading states to prevent UI flickering
 * during background refreshes.
 * 4. Selection Logic: Provides a localized toggle function to manage multi-select
 * interactions for bulk actions like check-ins.
 */

import { auth, db } from "@/firebaseConfig";
import { ChildProps } from "@/types/childData";
import { collection, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type AbsenceType = "sykdom" | "ferie" | null;

// UIChild type combines database properties with local UI state
export type UIChild = ChildProps & {
  selected?: boolean;
  absenceType?: AbsenceType;
  absenceFrom?: string | null;
  absenceTo?: string | null;
};

export const useChildrenForEmployee = () => {
  // --- STATE ---
  const [children, setChildren] = useState<UIChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const uid = auth.currentUser?.uid;

  /**
   * fetchChildren
   * Retrieves all child documents from Firestore.
   * @param isManual - If true, triggers a loading state even if data exists (refresh)
   */
  const fetchChildren = useCallback(
    async (isManual = false) => {
      // Safety check for authentication
      if (!uid) return;

      // Only show spinner on first load or manual refresh
      if (isManual || children.length === 0) {
        setLoading(true);
      }

      try {
        // 1. Fetch all documents from the 'children' collection
        const q = query(collection(db, "children"));
        const snap = await getDocs(q);

        // 2. Transform the Firestore snapshots into our UI-ready objects
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChildProps, "id">),
          // Set default values for properties not stored as defaults in DB
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

  /**
   * toggleSelect
   * Updates the 'selected' property for a specific child in the local list.
   * Used for bulk-action selections in the dashboard.
   */
  const toggleSelect = useCallback((id: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  }, []);

  /**
   * refreshData
   * Resets error state and forces a fresh network request.
   */
  const refreshData = useCallback(async () => {
    setError(null);
    await fetchChildren(true);
  }, [fetchChildren]);

  // Handle initial data load on component mount
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

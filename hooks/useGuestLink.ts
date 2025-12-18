/**
 * USE GUEST LINK HOOK
 * * ROLE:
 * Manages the state and logic for creating temporary "Guest Links."
 * * CORE FUNCTIONALITY:
 * 1. Modal State Management: Handles the visibility and cleanup of the guest
 * invitation form.
 * 2. Form Validation: Ensures that a target child is selected and that both
 * guest name and phone number are provided before attempting to save.
 * 3. Sub-collection Storage: Saves the guest request into a specific child's
 * 'guestLinks' sub-collection, allowing for granular tracking of who is
 * authorized to pick up which child.
 * 4. Parent Attribution: Fetches the current user's parent profile to link
 * the guest invitation to a specific requester for audit trails.
 */

import { getParent } from "@/api/parentApi";
import { db } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export const useGuestLink = () => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // --- STATE ---
  const [guestLinkVisible, setGuestLinkVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestSending, setGuestSending] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  // --- MODAL CONTROLS ---
  const openGuestLinkModal = () => {
    setGuestLinkVisible(true);
  };

  /**
   * closeGuestLinkModal
   * Closes the UI and resets all form inputs to prevent data leaking
   * between different invitation sessions.
   */
  const closeGuestLinkModal = () => {
    setGuestLinkVisible(false);
    setGuestName("");
    setGuestPhone("");
    setGuestError(null);
  };

  /**
   * sendGuestLink
   * Validates and saves a new guest record to the child's Firestore sub-collection.
   * @param overlayChildId - The ID of the child the guest is being invited for.
   */
  const sendGuestLink = async (overlayChildId: string | null) => {
    setGuestError(null);

    // 1. VALIDATION
    if (!overlayChildId) {
      setGuestError(getErrorMessage("guestLink", "NO_CHILD"));
      return;
    }
    if (!guestName.trim() || !guestPhone.trim()) {
      setGuestError(getErrorMessage("guestLink", "MISSING_FIELDS"));
      return;
    }

    setGuestSending(true);
    try {
      // 2. REFERENCE: Targets the guestLinks sub-collection for the specific child
      const guestColRef = collection(
        db,
        "children",
        overlayChildId,
        "guestLinks"
      );

      // 3. ATTRIBUTION: Attempt to find the parent ID to record who sent the link
      let parent = null;
      if (uid) {
        parent = await getParent(uid);
      }

      // 4. PAYLOAD CONSTRUCTION
      const payload = {
        name: guestName.trim(),
        phone: guestPhone.trim(),
        sentAt: serverTimestamp(),
        parentsId: parent?.id ?? null,
      };

      // 5. DATABASE PERSISTENCE
      await addDoc(guestColRef, payload);

      // SUCCESS: Cleanup and close
      setGuestName("");
      setGuestPhone("");
      setGuestLinkVisible(false);
    } catch (err) {
      console.error("Failed to save guest link:", err);
      setGuestError(getErrorMessage("guestLink", "CREATE_FAILED"));
    } finally {
      setGuestSending(false);
    }
  };

  return {
    // UI State
    guestLinkVisible,
    setGuestLinkVisible,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestSending,
    guestError,

    // Logic Functions
    openGuestLinkModal,
    closeGuestLinkModal,
    sendGuestLink,
    uid,
  };
};

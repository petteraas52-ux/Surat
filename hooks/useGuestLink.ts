import { getParent } from "@/api/parents";
import { db } from "@/firebaseConfig";
import { getErrorMessage } from "@/utils/error";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export const useGuestLink = () => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [guestLinkVisible, setGuestLinkVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestSending, setGuestSending] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  const openGuestLinkModal = () => {
    setGuestLinkVisible(true);
  };

  const closeGuestLinkModal = () => {
    setGuestLinkVisible(false);
    setGuestName("");
    setGuestPhone("");
    setGuestError(null);
  };

  const sendGuestLink = async (overlayChildId: string | null) => {
    setGuestError(null);

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
      const guestColRef = collection(
        db,
        "children",
        overlayChildId,
        "guestLinks"
      );

      let parent = null;
      if (uid) {
        parent = await getParent(uid);
      }

      const payload = {
        name: guestName.trim(),
        phone: guestPhone.trim(),
        sentAt: serverTimestamp(),
        parentsId: parent?.id ?? null,
      };

      await addDoc(guestColRef, payload);

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
    guestLinkVisible,
    setGuestLinkVisible,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestSending,
    guestError,
    openGuestLinkModal,
    closeGuestLinkModal,
    sendGuestLink,
    uid,
  };
};

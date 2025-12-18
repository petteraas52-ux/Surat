import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const users = ["parents", "employees"] as const;

export async function getUserPin(uid: string) {
  for (const collectionName of users) {
    const snap = await getDoc(doc(db, collectionName, uid));
    if (snap.exists()) return snap.data().pin ?? null;
  }
  return null;
}

export async function setUserPin(uid: string, pin: string) {
  let targetCollection: (typeof users)[number] | null = null;

  for (const collectionName of users) {
    const ref = doc(db, collectionName, uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      targetCollection = collectionName;
      break;
    }
  }

  if (targetCollection) {
    const ref = doc(db, targetCollection, uid);
    await setDoc(ref, { pin }, { merge: true });
    return;
  }

  throw new Error("User not found in any collection");
}

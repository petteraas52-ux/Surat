import { db } from "@/firebaseConfig";
import { doc,  getDoc, updateDoc } from "firebase/firestore";

const users = ["parents", "employees"] as const;

export async function getUserPin(uid: string) {
    for (const collection of users) {
        const snap = await getDoc(doc(db, collection, uid));
        if (snap.exists()) return snap.data().pin ?? null;
    }
    return null;
}

export async function setUserPin(uid: string, pin: string){
    for(const collection of users) {
        const ref = doc(db, collection, uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            await updateDoc(ref, {pin});
            return;
        }
    }
    
    throw new Error("Finner ikke bruker");
}
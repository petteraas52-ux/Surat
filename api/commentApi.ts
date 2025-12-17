import { db } from "@/firebaseConfig";
import { Comment } from "@/types/commentData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const commentsCollection = collection(db, "comments");

export async function createComment(
  comment: Omit<Comment, "id" | "createdAt">
) {
  try {
    const docRef = await addDoc(commentsCollection, {
      ...comment,
      createdAt: serverTimestamp(),
    });

    console.log("Comment created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error creating comment:", e);
  }
}

export async function getComments(childId: string): Promise<Comment[]> {
  try {
    const queryResult = query(
      commentsCollection,
      where("childId", "==", childId),
      orderBy("createdAt", "asc")
    );

    const snapShot = await getDocs(queryResult);

    return snapShot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Comment, "id">),
    }));
  } catch (e) {
    console.log("Error getting all comments", e);
    return [];
  }
}

export async function deleteComment(id: string) {
  try {
    await deleteDoc(doc(db, "comments", id));
  } catch (e) {
    console.log("Error deleting comment", e);
  }
}

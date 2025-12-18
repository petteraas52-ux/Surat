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

/**
 * Comments Collection Reference
 * Stores updates, messages, or notes regarding specific children.
 */
const commentsCollection = collection(db, "comments");

/**
 * CREATE COMMENT
 * CRUCIAL LOGIC: Uses 'serverTimestamp()'.
 * Instead of using the phone's local clock (which can be wrong or manipulated),
 * we let Google's servers set the time. This ensures the timeline of comments
 * is accurate for all users regardless of their time zone.
 */
export async function createComment(
  comment: Omit<Comment, "id" | "createdAt">
) {
  try {
    const docRef = await addDoc(commentsCollection, {
      ...comment,
      createdAt: serverTimestamp(), // Ensures high-integrity chronological order
    });

    console.log("Comment created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error creating comment:", e);
  }
}

/**
 * GET COMMENTS FOR A CHILD
 * PERFECTION NOTE: This query filters by 'childId' AND sorts by 'createdAt'.
 * GOTCHA: Firestore requires a 'Composite Index' for queries that use both
 * 'where' and 'orderBy' on different fields.
 * If this fails in development, check the console for a link to generate the index.
 */
export async function getComments(childId: string): Promise<Comment[]> {
  try {
    const queryResult = query(
      commentsCollection,
      where("childId", "==", childId),
      orderBy("createdAt", "asc") // Shows oldest comments first (standard chat/log flow)
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

/**
 * DELETE COMMENT
 * Standard deletion by document ID.
 * Note: Security rules should verify that the 'createdById' matches
 * the person attempting the delete.
 */
export async function deleteComment(id: string) {
  try {
    await deleteDoc(doc(db, "comments", id));
  } catch (e) {
    console.log("Error deleting comment", e);
  }
}

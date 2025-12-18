import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

/**
 * SIGNS IN EXISTING USERS
 * This function authenticates credentials against the Firebase Auth service.
 * Note: Firebase manages the secure password hashing and session tokens automatically.
 */
export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in ", userCredential);
    })
    .catch((error) => console.log("Kunne ikke logge inn!", error));
}

export async function signOut() {
  await auth.signOut();
}

/**
 * CREATES A NEW USER (SELF-SERVICE)
 * IMPORTANT: In Firebase Client SDK, this function automatically signs in the
 * newly created user and replaces the current session.
 * Use this for public registration only, not for Admin creating other users.
 */
export async function createUser(email: string, password: string) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredentials.user;
  } catch (error) {
    console.error("Kunne ikke opprette bruker!", error);
    return null;
  }
}

/**
 * UPDATES USER PROFILE
 * Sets the 'displayName' attribute on the Firebase Auth object.
 * This is separate from any data stored in Firestore.
 */
export async function setUserDisplayName(user: User, displayName: string) {
  try {
    await updateProfile(user, {
      displayName: displayName,
    });
  } catch (error) {
    console.error("Kunne ikke oppdatere visnings navn!", error);
  }
}

import { getStorageRef } from "@/firebaseConfig";
import { imageCache } from "@/utils/imageCache";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";

/**
 * IMAGE API SERVICE
 * This service handles the bridge between the device's local file system
 * and Google Firebase Storage.
 */

/**
 * UPLOADS AN IMAGE TO FIREBASE STORAGE
 * * CRUCIAL LOGIC: Blob Conversion
 * React Native "URIs" (file://...) cannot be sent directly to Firebase.
 * We must first 'fetch' the local file and convert it into a 'Blob' (Binary Large Object),
 * which is the format Firebase Storage understands.
 */
export async function uploadImageToFirebase(uri: string) {
  // Step 1: Convert the local file URI into binary data (Blob)
  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  // Step 2: Extract a filename or fallback to a default
  const imageName = uri.split("/").pop()?.split(".")[0] ?? "AnonymtBilde";
  const uploadPath = `images/${imageName}`;
  const imageRef = await getStorageRef(uploadPath);

  try {
    console.log("Starting upload");
    // Step 3: Use uploadBytesResumable to push the blob to the cloud
    await uploadBytesResumable(imageRef, blob);
    console.log("Image uploaded to firebase");

    /**
     * CACHE INVALIDATION:
     * If we upload a new version of an image with the same path,
     * we must clear the local cache so the app doesn't keep showing the old one.
     */
    await imageCache.invalidate(uploadPath);

    return uploadPath; // We return the PATH, not the URL, to store in Firestore
  } catch (e) {
    console.error("Error uploading image to firebase", e);
    return null;
  }
}

/**
 * RETRIEVES A VIEWABLE URL FOR AN IMAGE
 * * CRUCIAL LOGIC: Download URL vs. Path
 * We store the 'path' (e.g., images/photo.jpg) in the database because it is permanent.
 * The 'Download URL' is temporary and can expire. This function converts the path
 * into a usable URL and checks the local cache first to save user data/bandwidth.
 */
export async function getImageUrl(storagePath: string): Promise<string | null> {
  try {
    const imageRef = await getStorageRef(storagePath);
    const downloadUrl = await getDownloadURL(imageRef);

    // Check if we have this specific version of the image already saved locally
    const cachedUrl = await imageCache.get(storagePath, downloadUrl);
    return cachedUrl;
  } catch (e) {
    console.error("Error getting image URL:", e);
    return null;
  }
}

/**
 * FORCED REFRESH
 * Useful when a user updates their profile picture and you want to ensure
 * the UI updates immediately across all screens.
 */
export async function invalidateImageCache(storagePath: string) {
  await imageCache.invalidate(storagePath);
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getSTorage, ref, getDownloadURL } from "firebase/storage";
import { initializeAuth, getReactNativePersistence, } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/-async-storage";
import firebaseConfig from "./firebaseEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const storage = getStorage(app);

export const getStorageRef = (path) => ref(storage, path);

export const getDownloadUrl = async (path) => {
  const storageRef = getStorageRef(path);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBSASE_API_KEY,
  authDomain: "social-media-app-97c1d.firebaseap.com",
  projectId: "social-media-app-97c1d",
  storageBucket: "social-media-app-97c1d.appspot.com",
  messagingSenderId: "579482737295",
  appId: "1:579482737295:web:d13e013ee0e24e0c65aefa"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
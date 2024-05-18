import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const app = initializeApp(
    JSON.parse(process.env.EXPO_PUBLIC_FIREBASE)
);
export const db = getFirestore(app)

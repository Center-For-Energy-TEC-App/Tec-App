import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const app = initializeApp(
    JSON.parse(process.env.EXPO_PUBLIC_FIREBASE)
);

export const storage = getStorage(app)
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMyLUuheeYOgTK6qZbgmEyo009y_t7wB4",
  authDomain: "hatsugen-73b96.firebaseapp.com",
  projectId: "hatsugen-73b96",
  storageBucket: "hatsugen-73b96.appspot.com",
  messagingSenderId: "755746362339",
  appId: "1:755746362339:web:94274bae18b5f7e04346d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
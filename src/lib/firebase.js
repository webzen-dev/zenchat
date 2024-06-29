import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:"AIzaSyBllIUKr8VWJ66adQtEwVyZH8WlpUE3tis",
  authDomain: "zenchat-13156.firebaseapp.com",
  projectId: "zenchat-13156",
  storageBucket: "zenchat-13156.appspot.com",
  messagingSenderId: "701762603841",
  appId: "1:701762603841:web:6abd31baa34c02783a6fc0",
  measurementId: "G-CR342REZYW",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

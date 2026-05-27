import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBwmD_2i3vH-fn2vmQcHcY53Rt_j-c7ROo",
  authDomain: "localscore-27a63.firebaseapp.com",
  projectId: "localscore-27a63",
  storageBucket: "localscore-27a63.firebasestorage.app",
  messagingSenderId: "618366364635",
  appId: "1:618366364635:web:269fdc5ef956594c6715fe"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.log("Messaging not supported");
}
export { messaging };
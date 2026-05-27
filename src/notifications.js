import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = "BNny-7eH1KX7HwtjWWaGl88kk6sk1XNfwuuAxpoLNxOFFCk1JhfIL5HMOGQ1EH-9FoCPckgDios-22-sFzH0x-A";

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Notification error:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
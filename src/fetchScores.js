import { db } from "./firebase"; // ✅ CORRECT PATH
import { collection, getDocs } from "firebase/firestore";

export const fetchScores = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "scores"));

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
};
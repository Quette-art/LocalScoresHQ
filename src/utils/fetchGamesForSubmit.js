import { db } from '../firebase'; // Adjust path if necessary
import { collection, getDocs } from 'firebase/firestore';

export const fetchGamesForSubmit = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'games'));
    const games = querySnapshot.docs.map(doc => doc.data());
    return games;
  } catch (error) {
    console.error('Error fetching games for submit: ', error);
    return [];
  }
};
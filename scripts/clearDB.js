import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase.js';

async function clearDatabase() {
  console.log("Clearing opportunities collection...");
  try {
    const opportunitiesRef = collection(db, 'opportunities');
    const querySnapshot = await getDocs(opportunitiesRef);
    
    let deletedCount = 0;
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(docSnapshot.ref);
      deletedCount++;
    }
    
    console.log(`Successfully deleted ${deletedCount} documents.`);
  } catch (error) {
    console.error("Error clearing database:", error);
  }
  process.exit(0);
}

clearDatabase();

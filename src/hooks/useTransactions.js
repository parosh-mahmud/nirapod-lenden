import { db } from "../lib/firebaseConfig";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function useTransactions() {
  const auth = getAuth(); // Get authentication state

  const addTransaction = async (data) => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const transactionsRef = collection(db, "transactions");
      await addDoc(transactionsRef, data);
      console.log("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const getTransactions = async () => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return [];
    }

    try {
      const transactionsRef = collection(db, "transactions");
      const querySnapshot = await getDocs(transactionsRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  return { addTransaction, getTransactions };
}

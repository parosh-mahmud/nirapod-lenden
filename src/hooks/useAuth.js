import { useState, useEffect } from "react";
import { auth } from "@/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    console.log("User logged out.");
  };

  return { user, login, logout };
}

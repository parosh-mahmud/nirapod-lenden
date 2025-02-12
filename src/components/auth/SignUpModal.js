// components/modals/SignUpModal.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useSignUpModal } from "@/context/SignUpModalContext"; // or any context that controls this modal
import { FaTimes } from "react-icons/fa";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

export default function SignUpModal() {
  const { isSignUpOpen, setIsSignUpOpen } = useSignUpModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1) Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optionally update displayName (shows up in Firebase Auth user info)
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });

      // 2) Store user data in Firestore
      const userDocRef = doc(db, "providers", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          firstName,
          lastName,
          phone,
          email: user.email,
          provider: "password", // or "emailPassword"
          createdAt: new Date().toISOString(),
        });
      } else {
        // Merge or update if doc already exists
        await setDoc(
          userDocRef,
          {
            firstName,
            lastName,
            phone,
            email: user.email,
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // 3) Close the modal
      setIsSignUpOpen(false);
    } catch (err) {
      console.error("Sign up failed:", err);
      setError(err.message || "Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignUpOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsSignUpOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2">
            Sign up with your email and password.
          </p>
        </div>

        {/* Error Display */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        {/* Form Fields */}
        <div className="mt-6 space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="First Name"
              className="border p-2 rounded w-1/2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 rounded w-1/2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            className="border p-2 rounded w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 rounded w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignUp}
          disabled={isLoading}
          className={`w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition transform shadow-md ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 hover:scale-105"
          }`}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Toggle to Login */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              // For example:
              setIsSignUpOpen(false);
              // setIsOpen(true); // to open login modal
            }}
          >
            Log In
          </button>
        </div>
      </motion.div>
    </div>
  );
}

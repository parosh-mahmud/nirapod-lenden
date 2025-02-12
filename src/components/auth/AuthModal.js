import { useState } from "react";
import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext"; // your custom isOpen/setIsOpen
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

import { FaGoogle, FaTimes } from "react-icons/fa";

export default function AuthModal() {
  const { isOpen, setIsOpen } = useModal(); // your modal context controlling open state

  // Which form are we showing? "login" | "signup" | "forgot"
  const [mode, setMode] = useState("login");

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Login form fields -----
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ----- Sign-up form fields -----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ----- Forgot password form field -----
  const [resetEmail, setResetEmail] = useState("");

  // --------------------------------------------------------------------------
  // GOOGLE LOGIN HANDLER
  // --------------------------------------------------------------------------
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      // Attempt to sign in with popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check or create user doc in "users" collection
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Create new user doc
        await setDoc(userDocRef, {
          displayName: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || "google",
          createdAt: new Date().toISOString(),
        });
      } else {
        // Update existing doc with last login
        await setDoc(
          userDocRef,
          {
            displayName: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
            photoURL: user.photoURL || null,
            provider: user.providerData[0]?.providerId || "google",
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Close modal on success
      setIsOpen(false);
    } catch (err) {
      console.error("Google login failed:", err);

      // If the popup is blocked, try redirect
      if (err.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Redirect sign-in failed:", redirectError);
          setError("Popup blocked and redirect failed. Please allow popups.");
        }
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // EMAIL/PASSWORD LOGIN HANDLER
  // --------------------------------------------------------------------------
  const handleLoginWithEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      // userCred.user -> The signed-in user
      setIsOpen(false); // close modal
    } catch (err) {
      console.error("Email login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // SIGNUP HANDLER
  // --------------------------------------------------------------------------
  const handleSignUp = async () => {
    setIsError(null);
    setIsLoading(true);

    // Basic validation
    if (!firstName || !lastName || !signupEmail || !signupPassword) {
      setError("Please fill all required fields.");
      setIsLoading(false);
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      const user = userCred.user;

      // Optionally, update auth displayName
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user doc in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email: user.email,
        phone: phone || "",
        provider: "password", // or emailPassword
        createdAt: new Date().toISOString(),
      });

      // Close modal
      setIsOpen(false);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // FORGOT PASSWORD HANDLER
  // --------------------------------------------------------------------------
  const handleResetPassword = async () => {
    setIsLoading(true);
    setError(null);

    if (!resetEmail) {
      setError("Please enter your email.");
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      // You might show a success message or close the modal
      alert("Password reset link sent to your email.");
      setIsOpen(false);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER NOTHING IF MODAL NOT OPEN
  // --------------------------------------------------------------------------
  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // HELPER UI: FORM LAYOUTS
  // --------------------------------------------------------------------------
  const renderLoginForm = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800">Log In</h2>
      <p className="text-gray-500 mt-2">Use Email/Password or Google.</p>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        className="w-full mt-4 p-2 border rounded text-black"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        className="w-full mt-2 p-2 border rounded text-black"
      />

      {/* Login Button */}
      <button
        onClick={handleLoginWithEmail}
        disabled={isLoading}
        className={`w-full mt-4 py-2 bg-blue-600 text-white rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </button>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`w-full flex items-center justify-center mt-2 py-2 bg-red-500 text-white font-semibold rounded transition transform shadow-md ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-600 hover:scale-105"
        }`}
      >
        <FaGoogle className="text-white text-xl mr-2" />
        {isLoading ? "Please wait..." : "Sign In with Google"}
      </button>

      {/* Bottom Links */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
        <br />
        Forgot password?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setMode("forgot")}
        >
          Reset
        </button>
      </div>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
      <p className="text-gray-500 mt-2">Create a new account.</p>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-1/2 p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-1/2 p-2 border rounded text-black"
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={signupEmail}
        onChange={(e) => setSignupEmail(e.target.value)}
        className="w-full mt-2 p-2 border rounded text-black"
      />

      <input
        type="text"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full mt-2 p-2 border rounded text-black"
      />

      <input
        type="password"
        placeholder="Password"
        value={signupPassword}
        onChange={(e) => setSignupPassword(e.target.value)}
        className="w-full mt-2 p-2 border rounded text-black"
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mt-2 p-2 border rounded text-black"
      />

      {/* Sign Up Button */}
      <button
        onClick={handleSignUp}
        disabled={isLoading}
        className={`w-full mt-4 py-2 bg-green-600 text-white rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setMode("login")}
        >
          Log In
        </button>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
      <p className="text-gray-500 mt-2">
        Enter the email you used to sign up. We'll send a reset link.
      </p>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        className="w-full mt-4 p-2 border rounded text-black"
      />

      <button
        onClick={handleResetPassword}
        disabled={isLoading}
        className={`w-full mt-4 py-2 bg-purple-600 text-white rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
        }`}
      >
        {isLoading ? "Sending reset link..." : "Send Reset Link"}
      </button>

      <div className="mt-4 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setMode("login")}
        >
          Log In
        </button>
      </div>
    </>
  );

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* MODE-SPECIFIC FORMS */}
        <div className="text-center">
          {mode === "login" && renderLoginForm()}
          {mode === "signup" && renderSignUpForm()}
          {mode === "forgot" && renderForgotPasswordForm()}
        </div>
      </motion.div>
    </div>
  );
}

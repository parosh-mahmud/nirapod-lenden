// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useModal } from "@/context/ModalContext";
// import {
//   signInWithPopup,
//   signInWithRedirect,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { FaGoogle, FaTimes } from "react-icons/fa";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebaseConfig";

// export default function LoginModal() {
//   const { isOpen, setIsOpen } = useModal();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleGoogleLogin = async () => {
//     setIsLoading(true);
//     setError(null);
//     const provider = new GoogleAuthProvider();
//     try {
//       // Attempt to sign in with a popup first
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user; // Firebase user object

//       // Reference to the user's document in the "providers" collection
//       const userDocRef = doc(db, "providers", user.uid);
//       const docSnap = await getDoc(userDocRef);

//       if (!docSnap.exists()) {
//         // Create a new document if it doesn't exist
//         await setDoc(userDocRef, {
//           name: user.displayName,
//           email: user.email,
//           phone: user.phoneNumber || null,
//           photoURL: user.photoURL || null,
//           provider: user.providerData[0]?.providerId || "google",
//           createdAt: new Date().toISOString(),
//         });
//       } else {
//         // Merge in the latest login info
//         await setDoc(
//           userDocRef,
//           {
//             name: user.displayName,
//             email: user.email,
//             phone: user.phoneNumber || null,
//             photoURL: user.photoURL || null,
//             provider: user.providerData[0]?.providerId || "google",
//             lastLogin: new Date().toISOString(),
//           },
//           { merge: true }
//         );
//       }
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Login failed:", error);
//       // Fallback: if the popup is blocked, try redirect sign-in
//       if (error.code === "auth/popup-blocked") {
//         try {
//           await signInWithRedirect(auth, provider);
//           // Note: signInWithRedirect will not return a result immediately.
//         } catch (redirectError) {
//           console.error("Redirect sign-in failed:", redirectError);
//           setError(
//             "Popup blocked and redirect sign-in failed. Please allow popups and try again."
//           );
//         }
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         transition={{ duration: 0.3, ease: "easeOut" }}
//         className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md relative"
//       >
//         {/* Close Button */}
//         <button
//           onClick={() => setIsOpen(false)}
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//           aria-label="Close"
//         >
//           <FaTimes className="text-xl" />
//         </button>

//         {/* Modal Header */}
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800">লগইন করুন</h2>
//           <p className="text-gray-500 mt-2">
//             আমাদের প্ল্যাটফর্মে অ্যাক্সেস পেতে নিচে লগইন করুন।
//           </p>
//         </div>

//         {/* Display any error messages */}
//         {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

//         {/* Google Login Button */}
//         <button
//           onClick={handleGoogleLogin}
//           disabled={isLoading}
//           className={`w-full flex items-center justify-center mt-6 py-3 bg-primary text-white font-semibold rounded-lg transition transform shadow-md ${
//             isLoading
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-orange-600 hover:scale-105"
//           }`}
//         >
//           {isLoading ? (
//             <span>Signing in...</span>
//           ) : (
//             <>
//               <FaGoogle className="text-white text-xl mr-3" />
//               <span>গুগল দিয়ে লগইন করুন</span>
//             </>
//           )}
//         </button>
//       </motion.div>
//     </div>
//   );
// }

// components/modals/LoginModal.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext"; // Custom hook controlling "isOpen"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

export default function LoginModal() {
  const { isOpen, setIsOpen } = useModal(); // your custom context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      // Attempt to sign in with a popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Firebase user object

      // Check if user doc exists in "providers" (or "users") collection
      const userDocRef = doc(db, "providers", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Create new doc if it doesn't exist
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || null,
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || "google",
          createdAt: new Date().toISOString(),
        });
      } else {
        // Merge latest login info if doc already exists
        await setDoc(
          userDocRef,
          {
            name: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || null,
            photoURL: user.photoURL || null,
            provider: user.providerData[0]?.providerId || "google",
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      setIsOpen(false); // close the login modal
    } catch (error) {
      console.error("Login failed:", error);

      // Fallback if the popup is blocked
      if (error.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Redirect sign-in failed:", redirectError);
          setError(
            "Popup blocked and redirect sign-in failed. Please allow popups and try again."
          );
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Log In</h2>
          <p className="text-gray-500 mt-2">
            Use your Google account or register.
          </p>
        </div>

        {/* Error message */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center mt-6 py-3 bg-primary text-white font-semibold rounded-lg transition transform shadow-md ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-orange-600 hover:scale-105"
          }`}
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <FaGoogle className="text-white text-xl mr-3" />
              <span>Sign In with Google</span>
            </>
          )}
        </button>

        {/* Additional Options */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            // You could open a separate sign-up modal here
            onClick={() => {
              // For example, close login modal & open sign-up modal
              setIsOpen(false);
              // setIsSignUpOpen(true); // If you have a separate context or function
            }}
          >
            Sign Up
          </button>
          <br />
          Forgot your password?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              // Close login & open forgot-password modal
              setIsOpen(false);
              // setIsForgotOpen(true);
            }}
          >
            Reset it
          </button>
        </div>
      </motion.div>
    </div>
  );
}

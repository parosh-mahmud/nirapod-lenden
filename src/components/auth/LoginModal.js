import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle, FaTimes } from "react-icons/fa"; // Import Google and Close Icons
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
export default function LoginModal() {
  const { isOpen, setIsOpen } = useModal();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Firebase user object

      // Reference to the user's document in the "providers" collection
      const userDocRef = doc(db, "providers", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // If the document does not exist, create a new document with the user's data
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || null,
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || "google",
          createdAt: new Date().toISOString(),
        });
      } else {
        // If the document exists, update with the latest login info (optional)
        await setDoc(
          userDocRef,
          {
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber || null,
            photoURL: user.photoURL || null,
            provider: user.providerData[0]?.providerId || "google",
            lastLogin: new Date().toISOString(),
          },
          { merge: true } // Merges the fields with the existing document
        );
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
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
        {/* X Close Button at the Top Right */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">লগইন করুন</h2>
          <p className="text-gray-500 mt-2">
            আমাদের প্ল্যাটফর্মে অ্যাক্সেস পেতে নিচে লগইন করুন।
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center mt-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-600 transition transform hover:scale-105 shadow-md"
        >
          <FaGoogle className="text-white text-xl mr-3" />
          <span>গুগল দিয়ে লগইন করুন</span>
        </button>
      </motion.div>
    </div>
  );
}

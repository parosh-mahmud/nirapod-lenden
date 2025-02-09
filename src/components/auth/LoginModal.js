import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { FaGoogle } from "react-icons/fa"; // Import Google Icon

export default function LoginModal() {
  const { isOpen, setIsOpen } = useModal();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
        className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md"
      >
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

        {/* Cancel Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 w-full py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
        >
          বাতিল করুন
        </button>
      </motion.div>
    </div>
  );
}

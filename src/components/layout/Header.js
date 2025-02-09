import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useModal } from "@/context/ModalContext";
import LoginModal from "@/components/auth/LoginModal";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { setIsOpen } = useModal();

  return (
    <>
      <header className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            নিরাপদ লেনদেন
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-primary transition">
              হোম
            </Link>
            <Link href="/about" className="hover:text-primary transition">
              আমাদের সম্পর্কে
            </Link>
            <Link href="/services" className="hover:text-primary transition">
              সেবা
            </Link>
            <Link href="/contact" className="hover:text-primary transition">
              যোগাযোগ
            </Link>
          </nav>

          {/* Authentication */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  লগ আউট
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
              >
                লগইন
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal />
    </>
  );
}

// import Link from "next/link";
// import { useContext } from "react";
// import { AuthContext } from "@/context/AuthProvider";
// import { useModal } from "@/context/ModalContext";
// import LoginModal from "@/components/auth/LoginModal";

// export default function Header() {
//   const { user, logout } = useContext(AuthContext);
//   const { setIsOpen } = useModal();

//   return (
//     <>
//       <header className="bg-white shadow-md py-4 sticky top-0 z-50">
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="text-2xl font-bold text-primary">
//             নিরাপদ লেনদেন
//           </Link>

//           {/* Nav Links */}
//           <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
//             <Link href="/" className="hover:text-primary transition">
//               হোম
//             </Link>
//             <Link href="/about" className="hover:text-primary transition">
//               আমাদের সম্পর্কে
//             </Link>
//             <Link href="/services" className="hover:text-primary transition">
//               সেবা
//             </Link>
//             <Link href="/contact" className="hover:text-primary transition">
//               যোগাযোগ
//             </Link>
//           </nav>

//           {/* Authentication */}
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <>
//                 <img
//                   src={user.photoURL}
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full border border-gray-300"
//                 />
//                 <button
//                   onClick={logout}
//                   className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
//                 >
//                   লগ আউট
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
//               >
//                 লগইন
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Login Modal */}
//       <LoginModal />
//     </>
//   );
// }

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useModal } from "@/context/ModalContext";
import LoginModal from "@/components/auth/LoginModal";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { setIsOpen } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Header Section */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            নিরাপদ লেনদেন
          </Link>

          {/* Desktop Navigation */}
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

          {/* Authentication & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-500" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 text-gray-800 font-semibold">
                      {user.displayName || "User"}
                    </div>
                    <div className="border-t"></div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      প্রোফাইল
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      লগ আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
              >
                লগইন
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden focus:outline-none"
            >
              {menuOpen ? (
                <FaTimes className="text-2xl text-gray-700" />
              ) : (
                <FaBars className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden bg-white shadow-md">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              হোম
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              href="/services"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              সেবা
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              যোগাযোগ
            </Link>
          </nav>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal />
    </>
  );
}

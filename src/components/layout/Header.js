// import Link from "next/link";
// import { useContext, useState } from "react";
// import { AuthContext } from "@/context/AuthProvider";
// import { useModal } from "@/context/ModalContext";
// import LoginModal from "@/components/auth/LoginModal";
// import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
// export default function Header() {
//   const { user, logout } = useContext(AuthContext);
//   const { setIsOpen } = useModal();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <>
//       {/* Header Section */}
//       <header className="bg-white shadow-md py-4 sticky top-0 z-50">
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="text-2xl font-bold text-primary">
//             নিরাপদ লেনদেন
//           </Link>
//           <LanguageSwitcher />
//           {/* Desktop Navigation */}
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

//           {/* Authentication, Notification & Mobile Menu */}
//           <div className="flex items-center space-x-4">
//             {user && (
//               <>
//                 {/* Notification Icon */}
//                 <button
//                   type="button"
//                   className="relative focus:outline-none"
//                   aria-label="Notifications"
//                 >
//                   <FaBell className="text-2xl text-gray-700" />
//                   {/* Notification badge */}
//                   <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
//                     {/* Here you can show the count of notifications */}1
//                   </span>
//                 </button>

//                 {/* User Profile Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     className="flex items-center space-x-2 focus:outline-none"
//                   >
//                     {user.photoURL ? (
//                       <img
//                         src={user.photoURL}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full border border-gray-300"
//                       />
//                     ) : (
//                       <FaUserCircle className="text-3xl text-gray-500" />
//                     )}
//                   </button>
//                   {dropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
//                       <div className="px-4 py-2 text-gray-800 font-semibold">
//                         {user.displayName || "User"}
//                       </div>
//                       <div className="border-t"></div>
//                       <Link
//                         href="/profile"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                       >
//                         প্রোফাইল
//                       </Link>
//                       <button
//                         onClick={logout}
//                         className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//                       >
//                         লগ আউট
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//             {!user && (
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
//               >
//                 লগইন
//               </button>
//             )}

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="md:hidden focus:outline-none"
//             >
//               {menuOpen ? (
//                 <FaTimes className="text-2xl text-gray-700" />
//               ) : (
//                 <FaBars className="text-2xl text-gray-700" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {menuOpen && (
//           <nav className="md:hidden bg-white shadow-md">
//             <Link
//               href="/"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               হোম
//             </Link>
//             <Link
//               href="/about"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               আমাদের সম্পর্কে
//             </Link>
//             <Link
//               href="/services"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               সেবা
//             </Link>
//             <Link
//               href="/contact"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               যোগাযোগ
//             </Link>
//           </nav>
//         )}
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
import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthModal from "../auth/AuthModal";

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
          <LanguageSwitcher />
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

          {/* Authentication, Notification & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Notification Icon (click navigates to notifications page) */}
                <Link
                  href="/notifications"
                  className="relative focus:outline-none"
                  aria-label="Notifications"
                >
                  <FaBell className="text-2xl text-gray-700" />
                  {/* Notification badge */}
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    1
                  </span>
                </Link>

                {/* User Profile Dropdown */}
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
                      <Link
                        href="/transactions"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        লেনদেনসমূহ
                      </Link>
                      <Link
                        href="/wallet"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        ওয়ালেট
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
              </>
            )}
            {!user && (
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
      <AuthModal />
    </>
  );
}

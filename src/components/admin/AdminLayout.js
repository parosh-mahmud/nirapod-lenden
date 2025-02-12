// components/admin/AdminLayout.js
import Link from "next/link";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import SupportChat from "@/components/admin/SupportChat"; // optional floating chat

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaUsers />
                <span>Manage Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/transactions"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaMoneyBillWave />
                <span>Transactions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/chat"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaMoneyBillWave />
                <span>Chat Management</span>
              </Link>
            </li>
            {/* Add more admin links as needed */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-orange-400 relative">
        <header className="bg-primary-600 shadow p-4 flex justify-end">
          <button className="flex items-center space-x-2 text-white hover:text-white">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </header>

        <div className="p-6">{children}</div>

        {/* Floating support chat widget (optional) */}
        <SupportChat />
      </main>
    </div>
  );
}

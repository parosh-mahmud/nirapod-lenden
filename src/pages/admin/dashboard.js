// pages/admin/dashboard.js
import AdminChat from "@/components/admin/AdminChatDashboard";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">
        Admin Support Chat
      </h1>
      <AdminChat />
    </div>
  );
}

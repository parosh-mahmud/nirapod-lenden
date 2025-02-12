// pages/admin/chat.js
import AdminLayout from "@/components/admin/AdminLayout";
import AdminChatDashboard from "@/components/admin/AdminChatDashboard";

export default function AdminChatPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Chat Management</h1>
        <AdminChatDashboard />
      </div>
    </AdminLayout>
  );
}

// pages/support.js
import CustomerChat from "@/components/CustomerChat";

export default function SupportPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Customer Support</h1>
      <CustomerChat />
    </div>
  );
}

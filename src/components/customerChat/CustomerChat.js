// components/CustomerChat.jsx
import { useContext } from "react";
import ChatBox from "@/components/chatbox/ChatBox";
import { AuthContext } from "@/context/AuthProvider"; // Adjust path as needed

export default function CustomerChat() {
  const { user } = useContext(AuthContext);
  const senderName = user?.displayName || "Customer";

  // You might generate a unique chatRoom ID per conversation.
  // For simplicity, we use a static chat room name.
  return <ChatBox chatRoom="customer-support" sender={senderName} />;
}

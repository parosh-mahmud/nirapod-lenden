// components/admin/SupportChat.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaTimes } from "react-icons/fa";
import ChatBox from "@/components/chatbox/ChatBox";

export default function SupportChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg focus:outline-none"
            aria-label="Open Support Chat"
          >
            <FaComments className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
            style={{ width: "320px", height: "400px" }}
          >
            <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex justify-between items-center bg-blue-500 text-white px-4 py-2 rounded-t-lg">
                <span className="font-semibold">Support Chat</span>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="focus:outline-none"
                  aria-label="Close Chat"
                >
                  <FaTimes />
                </button>
              </div>
              {/* Chat Content */}
              <div className="flex-1 p-4 overflow-hidden">
                {/* Using a dedicated chat room for admin support and sender "Admin" */}
                <ChatBox chatRoom="support-chat" sender="Admin" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

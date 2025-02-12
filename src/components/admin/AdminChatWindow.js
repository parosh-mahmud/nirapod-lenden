import { useEffect, useState, useRef } from "react";
import { ref, onValue, push, update, off } from "firebase/database";
import { database } from "@/lib/firebaseConfig";

export default function AdminChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Listen for messages in this chatId
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      } else {
        setMessages([]);
      }
    });

    return () => {
      off(messagesRef);
    };
  }, [chatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      const newMsgRef = push(messagesRef);
      await update(newMsgRef, {
        user: "admin",
        text: newMessage,
        timestamp: Date.now(),
      });

      // Update the parent chat node
      const chatRef = ref(database, `chats/${chatId}`);
      await update(chatRef, {
        lastMessage: newMessage,
        lastUpdated: Date.now(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending admin message:", err);
    }
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Please select a chat to view messages.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 shadow-lg border border-gray-300 rounded-lg p-4">
      {/* Chat Header */}
      <h2 className="text-primary font-bold text-lg mb-3">Chat with User</h2>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white border border-gray-300 rounded-lg p-3 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg w-max max-w-xs ${
                msg.user === "admin"
                  ? "bg-primary text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <strong>{msg.user === "admin" ? "Admin" : msg.user}:</strong>{" "}
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Send button */}
      <div className="w-full flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-l-lg focus:outline-none text-gray-900"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your reply..."
        />
        <button
          onClick={sendMessage}
          className="flex-shrink-0 bg-primary text-white px-4 rounded-r-lg hover:bg-opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

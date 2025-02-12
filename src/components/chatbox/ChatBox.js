import { useEffect, useState, useRef } from "react";
import { ref, onValue, push, update, off } from "firebase/database";
import { database } from "@/lib/firebaseConfig";

export default function ChatBox({
  chatId = "customer-support",
  sender = "Customer",
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Listen to messages in the given chatId
  useEffect(() => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    // Realtime listener
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object of messages into array
        setMessages(Object.values(data));
      } else {
        setMessages([]);
      }
    });

    // Clean up listener on unmount
    return () => {
      off(messagesRef);
    };
  }, [chatId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      // 1) Push a new message to Realtime Database
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      const newMsgRef = push(messagesRef);
      await update(newMsgRef, {
        user: sender,
        text: input,
        timestamp: Date.now(), // or new Date().getTime()
      });

      // 2) Update parent "chats/{chatId}" with summary info
      const chatRef = ref(database, `chats/${chatId}`);
      await update(chatRef, {
        lastMessage: input,
        lastUpdated: Date.now(),
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-4 border border-gray-200">
      {/* Chat Header */}
      <h2 className="text-primary font-semibold text-lg mb-2">Live Chat</h2>

      {/* Messages Display */}
      <div className="w-full h-64 overflow-y-auto bg-gray-100 border border-gray-300 p-3 rounded-lg mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg my-1 ${
                msg.user === sender
                  ? "bg-primary text-white self-end text-right"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Send button */}
      <div className="w-full flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-l-lg focus:outline-none text-gray-900"
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

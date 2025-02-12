import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "@/lib/firebaseConfig";
import AdminChatWindow from "./AdminChatWindow";

export default function AdminChatDashboard() {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Listen to "chats" in Realtime Database
  useEffect(() => {
    const chatsRef = ref(database, "chats");

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert an object of objects to an array
        const roomsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setChatRooms(roomsArray);
      } else {
        setChatRooms([]);
      }
    });

    return () => {
      off(chatsRef);
    };
  }, []);

  return (
    <div className="flex h-[600px] bg-gray-100 shadow-lg rounded-lg border border-gray-300">
      {/* Left Pane: List of chat rooms */}
      <div className="w-1/4 border-r border-gray-300 bg-white p-4 overflow-y-auto">
        <h2 className="text-primary font-bold text-lg mb-3">Chat Rooms</h2>
        {chatRooms.length === 0 ? (
          <p className="text-gray-500">No active chats</p>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedChatId(room.id)}
              className={`cursor-pointer p-3 rounded-md transition ${
                selectedChatId === room.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <p className="font-semibold">ID: {room.id}</p>
              <p className="text-sm">
                Last Message: {room.lastMessage || "No messages yet"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right Pane: Selected chat window */}
      <div className="w-3/4 p-4 bg-white">
        {selectedChatId ? (
          <AdminChatWindow chatId={selectedChatId} />
        ) : (
          <p className="text-gray-500 text-center mt-24">
            Select a chat room to view messages
          </p>
        )}
      </div>
    </div>
  );
}

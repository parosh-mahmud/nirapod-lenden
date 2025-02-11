// pages/transactions.js
import { useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { AuthContext } from "@/context/AuthProvider";

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("sent"); // "sent", "received", "ongoing", "completed"
  const [sentTransactions, setSentTransactions] = useState([]);
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [ongoingTransactions, setOngoingTransactions] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Query for transactions submitted by the current user (sent requests)
    const sentQuery = query(
      collection(db, "transactions"),
      where("senderId", "==", user.uid)
    );
    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const transactions = [];
      snapshot.forEach((doc) =>
        transactions.push({ id: doc.id, ...doc.data() })
      );
      setSentTransactions(transactions);
    });

    // Query for transactions where the current user is the provider (received requests)
    const receivedQuery = query(
      collection(db, "transactions"),
      where("provider.email", "==", user.email)
    );
    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      const transactions = [];
      snapshot.forEach((doc) =>
        transactions.push({ id: doc.id, ...doc.data() })
      );
      setReceivedTransactions(transactions);
    });

    // Query for ongoing transactions (active status: "provider responded" or "in-progress")
    // Then filter further so that the current user is involved (either as sender or provider)
    const ongoingQuery = query(
      collection(db, "transactions"),
      where("status", "in", ["provider responded", "in-progress"])
    );
    const unsubscribeOngoing = onSnapshot(ongoingQuery, (snapshot) => {
      const transactions = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.senderId === user.uid ||
          (data.provider && data.provider.email === user.email)
        ) {
          transactions.push({ id: doc.id, ...data });
        }
      });
      setOngoingTransactions(transactions);
    });

    // Query for completed transactions (status === "completed")
    // Filter to only include transactions where the current user is involved.
    const completedQuery = query(
      collection(db, "transactions"),
      where("status", "==", "completed")
    );
    const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
      const transactions = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.senderId === user.uid ||
          (data.provider && data.provider.email === user.email)
        ) {
          transactions.push({ id: doc.id, ...data });
        }
      });
      setCompletedTransactions(transactions);
    });

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
      unsubscribeOngoing();
      unsubscribeCompleted();
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">লেনদেন</h1>
      <div className="mb-4 border-b">
        <nav className="flex space-x-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "sent"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            পাঠানো অনুরোধ
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "received"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("received")}
          >
            প্রাপ্ত অনুরোধ
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "ongoing"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            চলমান লেনদেন
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "completed"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            সম্পন্ন লেনদেন
          </button>
        </nav>
      </div>

      {/* Sent Requests */}
      {activeTab === "sent" && (
        <div>
          {sentTransactions.length === 0 ? (
            <p className="text-gray-600">কোনো পাঠানো অনুরোধ নেই।</p>
          ) : (
            <ul>
              {sentTransactions.map((tran) => (
                <li key={tran.id} className="border p-4 rounded-lg mb-2">
                  <p>
                    <strong>সেবা:</strong> {tran.serviceType}
                  </p>
                  <p>
                    <strong>বিবরণ:</strong> {tran.contractDetails}
                  </p>
                  <p>
                    <strong>পরিমাণ:</strong> {tran.amount} টাকা
                  </p>
                  <p>
                    <strong>তারিখ:</strong>{" "}
                    {new Date(tran.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Received Requests */}
      {activeTab === "received" && (
        <div>
          {receivedTransactions.length === 0 ? (
            <p className="text-gray-600">কোনো প্রাপ্ত অনুরোধ নেই।</p>
          ) : (
            <ul>
              {receivedTransactions.map((tran) => (
                <li
                  key={tran.id}
                  className="border p-4 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedTransaction(tran)}
                >
                  <p>
                    <strong>সেবা:</strong> {tran.serviceType}
                  </p>
                  <p>
                    <strong>বিবরণ:</strong>{" "}
                    {tran.contractDetails.length > 50
                      ? tran.contractDetails.slice(0, 50) + "..."
                      : tran.contractDetails}
                  </p>
                  <p>
                    <strong>তারিখ:</strong>{" "}
                    {new Date(tran.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Ongoing Transactions */}
      {activeTab === "ongoing" && (
        <div>
          {ongoingTransactions.length === 0 ? (
            <p className="text-gray-600">কোনো চলমান লেনদেন নেই।</p>
          ) : (
            <ul>
              {ongoingTransactions.map((tran) => (
                <li
                  key={tran.id}
                  className="border p-4 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedTransaction(tran)}
                >
                  <p>
                    <strong>সেবা:</strong> {tran.serviceType}
                  </p>
                  <p>
                    <strong>বিবরণ:</strong>{" "}
                    {tran.contractDetails.length > 50
                      ? tran.contractDetails.slice(0, 50) + "..."
                      : tran.contractDetails}
                  </p>
                  <p>
                    <strong>তারিখ:</strong>{" "}
                    {new Date(tran.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>অবস্থা:</strong> {tran.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Completed Transactions */}
      {activeTab === "completed" && (
        <div>
          {completedTransactions.length === 0 ? (
            <p className="text-gray-600">কোনো সম্পন্ন লেনদেন নেই।</p>
          ) : (
            <ul>
              {completedTransactions.map((tran) => (
                <li key={tran.id} className="border p-4 rounded-lg mb-2">
                  <p>
                    <strong>সেবা:</strong> {tran.serviceType}
                  </p>
                  <p>
                    <strong>বিবরণ:</strong> {tran.contractDetails}
                  </p>
                  <p>
                    <strong>পরিমাণ:</strong> {tran.amount} টাকা
                  </p>
                  <p>
                    <strong>তারিখ:</strong>{" "}
                    {new Date(tran.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>অবস্থা:</strong> {tran.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Detail View Modal for a Transaction (used for received or ongoing) */}
      {selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">লেনদেনের বিস্তারিত</h2>
            <p>
              <strong>সেবা:</strong> {selectedTransaction.serviceType}
            </p>
            <p>
              <strong>চুক্তির বিবরণ:</strong>{" "}
              {selectedTransaction.contractDetails}
            </p>
            <p>
              <strong>পরিমাণ:</strong> {selectedTransaction.amount} টাকা
            </p>
            <p>
              <strong>সময়সীমা:</strong> {selectedTransaction.deadline}
            </p>
            {selectedTransaction.additionalNotes && (
              <p>
                <strong>অতিরিক্ত নোটস:</strong>{" "}
                {selectedTransaction.additionalNotes}
              </p>
            )}
            {selectedTransaction.attachedDocs &&
              selectedTransaction.attachedDocs.length > 0 && (
                <div className="mt-2">
                  <strong>সংযুক্ত ডকুমেন্টস:</strong>
                  <ul className="list-disc list-inside">
                    {selectedTransaction.attachedDocs.map((url, index) => (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {`Document ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {selectedTransaction.audioURL && (
              <div className="mt-2">
                <strong>ভয়েস ইনপুট:</strong>
                <audio
                  controls
                  src={selectedTransaction.audioURL}
                  className="w-full"
                />
              </div>
            )}
            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// pages/transactions.js
import { useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { AuthContext } from "@/context/AuthProvider";
import TransactionDetailView from "@/components/transactions/TransactionDetailView";

export default function Transactions() {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("sent"); // "sent", "received", "ongoing", "completed"

  const [sentTransactions, setSentTransactions] = useState([]);
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [ongoingTransactions, setOngoingTransactions] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // On-mount effect to load transactions in real-time
  useEffect(() => {
    if (!user) return;

    // 1) "Sent" Transactions: user is the sender (senderId = user.uid)
    const sentQ = query(
      collection(db, "transactions"),
      where("senderId", "==", user.uid)
    );
    const unsubscribeSent = onSnapshot(sentQ, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setSentTransactions(list);
    });

    // 2) "Received" Transactions: user is the provider (provider.email === user.email)
    const receivedQ = query(
      collection(db, "transactions"),
      where("provider.email", "==", user.email)
    );
    const unsubscribeReceived = onSnapshot(receivedQ, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setReceivedTransactions(list);
    });

    // 3) "Ongoing" Transactions: status in ["provider responded","in-progress"]
    //    user is involved (sender or provider).
    const ongoingQ = query(
      collection(db, "transactions"),
      where("status", "in", ["provider responded", "in-progress"])
    );
    const unsubscribeOngoing = onSnapshot(ongoingQ, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // check if user is involved
        if (
          data.senderId === user.uid ||
          (data.provider && data.provider.email === user.email)
        ) {
          list.push({ id: doc.id, ...data });
        }
      });
      setOngoingTransactions(list);
    });

    // 4) "Completed" Transactions: status === "completed"
    //    user is involved (sender or provider).
    const completedQ = query(
      collection(db, "transactions"),
      where("status", "==", "completed")
    );
    const unsubscribeCompleted = onSnapshot(completedQ, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.senderId === user.uid ||
          (data.provider && data.provider.email === user.email)
        ) {
          list.push({ id: doc.id, ...data });
        }
      });
      setCompletedTransactions(list);
    });

    // Cleanup
    return () => {
      unsubscribeSent();
      unsubscribeReceived();
      unsubscribeOngoing();
      unsubscribeCompleted();
    };
  }, [user]);

  // For truncating text
  const truncate = (text, length = 50) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  // Handle an update from the detail view (e.g. "provider responded")
  // Usually, our onSnapshot will re-fetch in real time, so we can just close the detail
  const onTransactionUpdated = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">লেনদেন</h1>

      {/* If a transaction is selected, show the inline detail view */}
      {selectedTransaction ? (
        <TransactionDetailView
          transaction={selectedTransaction}
          user={user}
          onBack={() => setSelectedTransaction(null)}
          onTransactionUpdated={onTransactionUpdated}
        />
      ) : (
        // Otherwise show the transaction lists in tabs
        <>
          {/* Tab Navigation */}
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
                    <li
                      key={tran.id}
                      className="border p-4 rounded-lg mb-2 hover:bg-gray-500 cursor-pointer"
                      onClick={() => setSelectedTransaction(tran)}
                    >
                      <p>
                        <strong>সেবা:</strong> {tran.serviceType}
                      </p>
                      <p>
                        <strong>বিবরণ:</strong> {truncate(tran.contractDetails)}
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
                      className="border p-4 rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(tran)}
                    >
                      <p>
                        <strong>সেবা:</strong> {tran.serviceType}
                      </p>
                      <p>
                        <strong>বিবরণ:</strong> {truncate(tran.contractDetails)}
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
                      className="border p-4 rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(tran)}
                    >
                      <p>
                        <strong>সেবা:</strong> {tran.serviceType}
                      </p>
                      <p>
                        <strong>বিবরণ:</strong> {truncate(tran.contractDetails)}
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
                    <li
                      key={tran.id}
                      className="border p-4 rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(tran)}
                    >
                      <p>
                        <strong>সেবা:</strong> {tran.serviceType}
                      </p>
                      <p>
                        <strong>বিবরণ:</strong>{" "}
                        {truncate(tran.contractDetails, 80)}
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
        </>
      )}
    </div>
  );
}

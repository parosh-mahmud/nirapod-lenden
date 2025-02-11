// ProviderTransactionView.jsx
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { FaMicrophone, FaStop } from "react-icons/fa";

export default function ProviderTransactionView() {
  // Assume the provider's contact is known (for example, from auth context)
  const providerContactIdentifier = "provider@example.com";
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [responseData, setResponseData] = useState({
    biboron: "",
    interested: false,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [timerInterval, setTimerInterval] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState("");

  // Fetch transactions where the providerContact matches the provider's identifier.
  const fetchTransactions = async () => {
    try {
      const transactionsRef = collection(db, "transactions");
      const q = query(
        transactionsRef,
        where("providerContact", "==", providerContactIdentifier)
      );
      const querySnapshot = await getDocs(q);
      let trans = [];
      querySnapshot.forEach((docSnap) => {
        trans.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTransactions(trans);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle changes in the provider's response form.
  const handleResponseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResponseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Voice recording functions (similar to the customer form)
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("আপনার ব্রাউজার ভয়েস রেকর্ডিং সমর্থন করে না");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let chunks = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
      setRecordingTime(60);
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // When the provider submits their response, update the transaction document.
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) return;
    setIsSubmitting(true);
    try {
      const transactionRef = doc(db, "transactions", selectedTransaction.id);
      await updateDoc(transactionRef, {
        providerResponse: {
          biboron: responseData.biboron,
          audioURL,
          interested: responseData.interested,
          respondedAt: new Date().toISOString(),
        },
        status: "provider responded",
      });
      setResponseSuccess("আপনার উত্তর সফলভাবে জমা হয়েছে!");
      // Refresh the transactions list.
      fetchTransactions();
      // Clear the selected transaction and response fields.
      setSelectedTransaction(null);
      setResponseData({ biboron: "", interested: false });
      setAudioURL("");
    } catch (error) {
      console.error("Error submitting provider response:", error);
      alert("উত্তর জমা দিতে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          আপনার জন্য জমা হওয়া লেনদেনসমূহ
        </h2>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-600">কোন লেনদেন পাওয়া যায়নি।</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((trans) => (
              <div
                key={trans.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTransaction(trans)}
              >
                <p className="font-bold text-gray-800">{trans.serviceType}</p>
                <p className="text-gray-600">
                  {trans.contractDetails.slice(0, 50)}...
                </p>
                <p className="text-sm text-gray-500">
                  জমা হয়েছে: {new Date(trans.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Provider response modal / section */}
        {selectedTransaction && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">লেনদেনের বিস্তারিত</h3>
            <div className="mb-4">
              <p>
                <span className="font-medium">সেবা ধরন:</span>{" "}
                {selectedTransaction.serviceType}
              </p>
              <p>
                <span className="font-medium">চুক্তির বিবরণ:</span>{" "}
                {selectedTransaction.contractDetails}
              </p>
              <p>
                <span className="font-medium">পরিমাণ:</span>{" "}
                {selectedTransaction.amount} টাকা
              </p>
              <p>
                <span className="font-medium">সীমা:</span>{" "}
                {selectedTransaction.deadline}
              </p>
              {selectedTransaction.additionalNotes && (
                <p>
                  <span className="font-medium">অতিরিক্ত নোটস:</span>{" "}
                  {selectedTransaction.additionalNotes}
                </p>
              )}
              {selectedTransaction.audioURL && (
                <div className="mt-2">
                  <p className="font-medium">ভয়েস ইনপুট:</p>
                  <audio
                    controls
                    src={selectedTransaction.audioURL}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitResponse}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  আপনার বিবরণ (বিবরণ)
                </label>
                <textarea
                  name="biboron"
                  value={responseData.biboron}
                  onChange={handleResponseChange}
                  rows="3"
                  placeholder="আপনার বিবরণ লিখুন..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
                  required
                ></textarea>
              </div>

              {/* Voice response recording */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  ভয়েস ইনপুট (যদি থাকে)
                </label>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isRecording ? (
                        <p className="text-sm text-gray-600">
                          রেকর্ডিং চলছে: {recordingTime} সেকেন্ড বাকি...
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          আপনি ১ মিনিটের জন্য ভয়েস ইনপুট প্রদান করতে পারবেন।
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition"
                          aria-label="রেকর্ড শুরু করুন"
                        >
                          <FaMicrophone className="text-xl" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          aria-label="রেকর্ড বন্ধ করুন"
                        >
                          <FaStop className="text-xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {audioURL && (
                  <div className="mt-2">
                    <p className="text-gray-700 mb-2">
                      রেকর্ড করা ভয়েস প্লে করুন:
                    </p>
                    <audio controls src={audioURL} className="w-full" />
                  </div>
                )}
              </div>

              {/* Checkbox: I am interested */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="interested"
                  checked={responseData.interested}
                  onChange={handleResponseChange}
                  id="interested"
                  className="mr-2"
                  required
                />
                <label htmlFor="interested" className="text-gray-700">
                  আমি এই লেনদেন এ আগ্রহী
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 text-white rounded-lg text-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark transition"
                }`}
              >
                {isSubmitting ? "উত্তর জমা হচ্ছে..." : "উত্তর জমা দিন"}
              </button>
              {responseSuccess && (
                <div className="mt-4 text-green-700 bg-green-100 p-3 rounded">
                  {responseSuccess}
                </div>
              )}
            </form>
            {/* Button to close the response view */}
            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              লেনদেন বন্ধ করুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

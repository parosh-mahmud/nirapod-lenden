import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";

// A small helper to check if we are in a browser environment (for voice recording).
const canUseMicrophone =
  typeof window !== "undefined" && navigator.mediaDevices;

export default function TransactionDetailModal({
  transaction,
  user,
  onClose,
  onTransactionUpdated,
}) {
  // providerContractDetails: for provider to add extra description
  const [providerContractDetails, setProviderContractDetails] = useState("");
  const [isInterested, setIsInterested] = useState(false);

  // Voice recording states for provider
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [providerAudioURL, setProviderAudioURL] = useState("");
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    // Cleanup timer if modal unmounts
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Start Recording
  const startRecording = async () => {
    if (!canUseMicrophone) {
      alert("Your browser does not support microphone access!");
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
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        // Upload to Firebase Storage
        const audioRef = ref(storage, `providerAudio/${Date.now()}-resp.mp3`);
        await uploadBytes(audioRef, audioBlob);
        const downloadURL = await getDownloadURL(audioRef);
        setProviderAudioURL(downloadURL);
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
      console.error("Failed to record audio:", error);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  };

  // Handle provider “I’m interested” update
  const handleProviderSubmit = async () => {
    try {
      // 1) Build the update payload
      // 2) Mark status as "provider responded" (or whatever you want)
      //    or store additional fields so the sender sees them in “sent” requests

      const docRef = doc(db, "transactions", transaction.id);
      const updates = {
        status: "provider responded",
        providerResponse: {
          providerContractDetails,
          providerAudioURL,
          isInterested,
          respondedAt: new Date().toISOString(),
        },
      };

      await updateDoc(docRef, updates);

      // Optionally let the parent know to refresh or to close the modal
      if (onTransactionUpdated) onTransactionUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Could not update transaction. Try again.");
    }
  };

  // If the user is the **sender**, we show a separate button
  // E.g., “নির্ধারিত টাকা জমা করুন”
  const handleSenderPayment = () => {
    // Implementation depends on your logic, e.g.:
    // - redirect to a payment page
    // - update the transaction to "paid"
    alert("Here you might redirect to a payment page or do some action");
  };

  // Basic checks to see if user is provider or sender
  const isUserProvider =
    user && transaction.provider && transaction.provider.email === user.email;

  const isUserSender = user && transaction.senderId === user.uid;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
        <h2 className="text-2xl font-bold mb-4">লেনদেনের বিস্তারিত</h2>
        <p className="mb-1">
          <strong>সেবা:</strong> {transaction.serviceType}
        </p>
        <p className="mb-1">
          <strong>চুক্তির বিবরণ:</strong> {transaction.contractDetails}
        </p>
        <p className="mb-1">
          <strong>পরিমাণ:</strong> {transaction.amount} টাকা
        </p>
        <p className="mb-1">
          <strong>সময়সীমা:</strong> {transaction.deadline}
        </p>

        {/* Attached docs from the sender */}
        {transaction.attachedDocs && transaction.attachedDocs.length > 0 && (
          <div className="mt-2">
            <strong>সংযুক্ত ডকুমেন্টস:</strong>
            <ul className="list-disc list-inside">
              {transaction.attachedDocs.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    ডকুমেন্ট {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sender's audio */}
        {transaction.audioURL && (
          <div className="mt-2">
            <strong>ভয়েস ইনপুট (সেন্ডার):</strong>
            <audio
              controls
              src={transaction.audioURL}
              className="w-full mt-1"
            />
          </div>
        )}

        {/* If the provider already responded once, show it */}
        {transaction.providerResponse && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">সেবা প্রদানকারীর প্রতিক্রিয়া</h3>
            <p>
              <strong>চুক্তির বিস্তারিত:</strong>{" "}
              {transaction.providerResponse.providerContractDetails}
            </p>
            {transaction.providerResponse.providerAudioURL && (
              <div className="mt-2">
                <strong>সেবা প্রদানকারীর ভয়েস:</strong>
                <audio
                  controls
                  src={transaction.providerResponse.providerAudioURL}
                  className="w-full mt-1"
                />
              </div>
            )}
            <p className="mt-2">
              <strong>আগ্রহ:</strong>{" "}
              {transaction.providerResponse.isInterested
                ? "হ্যাঁ, আগ্রহী"
                : "না"}
            </p>
          </div>
        )}

        {/* --- PROVIDER SECTION: display if user is provider & status = submitted --- */}
        {isUserProvider && transaction.status === "submitted" && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-2">
              আপনার প্রতিক্রিয়া যোগ করুন
            </h3>

            {/* Contract details */}
            <textarea
              className="w-full border p-2 rounded mb-2"
              rows={3}
              placeholder="আপনার চুক্তির বিস্তারিত লিখুন..."
              value={providerContractDetails}
              onChange={(e) => setProviderContractDetails(e.target.value)}
            />

            {/* Voice input for provider */}
            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1">
                আপনার ভয়েস ইনপুট
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
                        আপনি ১ মিনিট পর্যন্ত ভয়েস ইনপুট দিতে পারেন।
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-2 bg-primary text-white rounded"
                      >
                        রেকর্ড
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-3 py-2 bg-red-600 text-white rounded"
                      >
                        বন্ধ
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {providerAudioURL && (
                <div className="mt-2">
                  <p className="text-gray-700 mb-2">রেকর্ড প্লে করুন:</p>
                  <audio controls src={providerAudioURL} className="w-full" />
                </div>
              )}
            </div>

            {/* Interested checkbox */}
            <div className="flex items-center mb-4">
              <input
                id="interestCheckbox"
                type="checkbox"
                checked={isInterested}
                onChange={() => setIsInterested(!isInterested)}
                className="mr-2"
              />
              <label htmlFor="interestCheckbox">আমি এই লেনদেন এ আগ্রহী</label>
            </div>

            {/* Submit */}
            <button
              onClick={handleProviderSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              তথ্য আপডেট করুন
            </button>
          </div>
        )}

        {/* --- SENDER SECTION: display if user is the sender & status = "provider responded" --- */}
        {isUserSender && transaction.status === "provider responded" && (
          <div className="mt-6 border-t pt-4">
            <button
              onClick={handleSenderPayment}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              নির্ধারিত টাকা জমা করুন
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}

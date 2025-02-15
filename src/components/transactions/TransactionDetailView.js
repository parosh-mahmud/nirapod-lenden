import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";

// Optional helper: check if microphone is available
const canUseMicrophone =
  typeof window !== "undefined" && navigator.mediaDevices;

export default function TransactionDetailView({
  transaction,
  user,
  onBack, // Replaces "onClose" in a modal
  onTransactionUpdated,
}) {
  // For the provider to add extra details:
  const [providerContractDetails, setProviderContractDetails] = useState("");
  const [isInterested, setIsInterested] = useState(false);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [providerAudioURL, setProviderAudioURL] = useState("");
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    // Cleanup recording timer if this component unmounts
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Start recording (provider)
  const startRecording = async () => {
    if (!canUseMicrophone) {
      alert("Your browser does not support microphone access.");
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

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  };

  // Update the transaction doc if provider is responding
  const handleProviderSubmit = async () => {
    try {
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

      // Refresh the parent or do something else
      if (onTransactionUpdated) onTransactionUpdated();
      onBack(); // Then "go back" to the list
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Could not update transaction. Try again.");
    }
  };

  // Example: when sender chooses to pay
  const handleSenderPayment = () => {
    // Implementation depends on your logic:
    // e.g., redirect to a payment page, or update the doc to "paid," etc.
    alert(
      "You would now direct the sender to a payment flow or do some other action."
    );
  };

  // Check if the user is the provider
  const isUserProvider =
    user && transaction.provider && transaction.provider.email === user.email;

  // Check if the user is the sender
  const isUserSender = user && transaction.senderId === user.uid;

  // Render
  return (
    <div className="bg-white border rounded-md shadow p-6 mb-6">
      {/* "Back" Button */}
      <button
        onClick={onBack}
        className="inline-block px-4 py-2 mb-4 text-white bg-primary rounded hover:bg-opacity-90"
      >
        ← ফিরে যান
      </button>

      <h2 className="text-2xl text-primary font-bold mb-4">
        লেনদেনের বিস্তারিত
      </h2>

      <div className="space-y-2 text-gray-800">
        <p>
          <span className="font-semibold text-primary">সেবা:</span>{" "}
          {transaction.serviceType}
        </p>
        <p>
          <span className="font-semibold text-primary">চুক্তির বিবরণ:</span>{" "}
          {transaction.contractDetails}
        </p>
        <p>
          <span className="font-semibold text-primary">পরিমাণ:</span>{" "}
          {transaction.amount} টাকা
        </p>
        <p>
          <span className="font-semibold text-primary">সময়সীমা:</span>{" "}
          {transaction.deadline}
        </p>
      </div>

      {/* Attached docs from the sender */}
      {transaction.attachedDocs && transaction.attachedDocs.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-primary mb-2">
            সংযুক্ত ডকুমেন্টস:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {transaction.attachedDocs.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  ডকুমেন্ট {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sender's audio */}
      {transaction.audioURL && (
        <div className="mt-4">
          <h3 className="font-semibold text-primary">ভয়েস ইনপুট (সেন্ডার):</h3>
          <audio controls src={transaction.audioURL} className="w-full mt-1" />
        </div>
      )}

      {/* Provider's response, if any */}
      {transaction.providerResponse && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2 text-primary">
            সেবা প্রদানকারীর প্রতিক্রিয়া
          </h3>
          <p className="text-gray-800">
            <strong className="text-primary">চুক্তির বিস্তারিত:</strong>{" "}
            {transaction.providerResponse.providerContractDetails}
          </p>
          {transaction.providerResponse.providerAudioURL && (
            <div className="mt-2">
              <strong className="text-primary">সেবা প্রদানকারীর ভয়েস:</strong>
              <audio
                controls
                src={transaction.providerResponse.providerAudioURL}
                className="w-full mt-1"
              />
            </div>
          )}
          <p className="mt-2 text-gray-800">
            <strong className="text-primary">আগ্রহ:</strong>{" "}
            {transaction.providerResponse.isInterested ? "হ্যাঁ, আগ্রহী" : "না"}
          </p>
        </div>
      )}

      {/* Provider Section (if user is provider + status=submitted) */}
      {isUserProvider && transaction.status === "submitted" && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg text-primary font-bold mb-2">
            আপনার প্রতিক্রিয়া যোগ করুন
          </h3>
          <textarea
            className="w-full border p-2 rounded mb-2 text-gray-800"
            rows={3}
            placeholder="আপনার চুক্তির বিস্তারিত লিখুন..."
            value={providerContractDetails}
            onChange={(e) => setProviderContractDetails(e.target.value)}
          />

          {/* Provider voice input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              আপনার ভয়েস ইনপুট
            </label>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-gray-600">
                  {isRecording ? (
                    <p className="text-sm">
                      রেকর্ডিং চলছে: {recordingTime} সেকেন্ড বাকি...
                    </p>
                  ) : (
                    <p className="text-sm">
                      আপনি ১ মিনিট পর্যন্ত ভয়েস ইনপুট দিতে পারেন।
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                    >
                      রেকর্ড
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      বন্ধ
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Show the recorded audio preview */}
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
            <label htmlFor="interestCheckbox" className="text-gray-700">
              আমি এই লেনদেন এ আগ্রহী
            </label>
          </div>

          {/* Submit button */}
          <button
            onClick={handleProviderSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            তথ্য আপডেট করুন
          </button>
        </div>
      )}

      {/* Sender Section (if user is sender + status=provider responded) */}
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
    </div>
  );
}

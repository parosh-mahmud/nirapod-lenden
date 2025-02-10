import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function TransactionForm() {
  const [formData, setFormData] = useState({
    serviceType: "",
    contractDetails: "",
    amount: "",
    deadline: "",
    additionalNotes: "",
    providerContact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // For document attachments
  const [attachedDocs, setAttachedDocs] = useState([]);

  // For provider search results
  const [providerSearchResults, setProviderSearchResults] = useState([]);
  // New state for the selected provider
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [timerInterval, setTimerInterval] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes for document attachments
  const handleFileChange = (e) => {
    setAttachedDocs(e.target.files);
  };

  // Handler for searching the provider in Firestore based on email or phone number
  const handleSearchProvider = async () => {
    try {
      const input = formData.providerContact.trim();
      if (!input) {
        alert("অনুগ্রহ করে ফোন নাম্বার অথবা ইমেইল প্রদান করুন।");
        return;
      }
      const providersRef = collection(db, "providers");
      // Query by email
      const emailQuery = query(providersRef, where("email", "==", input));
      // Query by phone
      const phoneQuery = query(providersRef, where("phone", "==", input));
      const emailSnapshot = await getDocs(emailQuery);
      const phoneSnapshot = await getDocs(phoneQuery);
      let results = [];
      emailSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      phoneSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      if (results.length === 0) {
        alert("কোনো সেবা প্রদানকারী পাওয়া যায়নি।");
      }
      setProviderSearchResults(results);
    } catch (error) {
      console.error("Error searching provider:", error);
      alert("সার্চে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।");
    }
  };

  // When a provider is selected, update the form data and set the selected provider state.
  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    setFormData({
      ...formData,
      providerContact: provider.email || provider.phone,
    });
    setProviderSearchResults([]); // Clear search results after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you can create a FormData instance and append fields & files.
    // For example:
    // let data = new FormData();
    // data.append("serviceType", formData.serviceType);
    // data.append("contractDetails", formData.contractDetails);
    // data.append("amount", formData.amount);
    // data.append("deadline", formData.deadline);
    // data.append("additionalNotes", formData.additionalNotes);
    // data.append("providerContact", formData.providerContact);
    // if (attachedDocs.length > 0) {
    //   for (let i = 0; i < attachedDocs.length; i++) {
    //     data.append("documents", attachedDocs[i]);
    //   }
    // }
    // Then submit `data` to your API endpoint.

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("আপনার লেনদেনের অনুরোধ সফলভাবে জমা হয়েছে!");
      setFormData({
        serviceType: "",
        contractDetails: "",
        amount: "",
        deadline: "",
        additionalNotes: "",
        providerContact: "",
      });
      setAttachedDocs([]);
      setAudioURL("");
      setProviderSearchResults([]);
      setSelectedProvider(null);
    }, 2000);
  };

  // Improved voice recording using a local chunks variable for preview
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("আপনার ব্রাউজার ভয়েস রেকর্ডিং সমর্থন করে না");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let chunks = []; // Local variable to store audio chunks
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

  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          লেনদেনের তথ্য প্রদান ফর্ম
        </h2>
        <p className="text-gray-600 text-center mb-8">
          আপনার চুক্তির তথ্য সমূহ সঠিকভাবে প্রদান করুন এবং সেবা প্রদানকারীর কাছে
          পাঠান।
        </p>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {successMessage && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* সেবা প্রদানকারীর যোগাযোগ তথ্য */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                সেবা প্রদানকারীর ফোন নাম্বার অথবা ইমেইল
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="providerContact"
                  value={formData.providerContact}
                  onChange={handleChange}
                  placeholder="ফোন নাম্বার অথবা ইমেইল লিখুন..."
                  className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-primary focus:border-primary text-gray-800"
                />
                <button
                  type="button"
                  onClick={handleSearchProvider}
                  className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition"
                >
                  সার্চ করুন
                </button>
              </div>
              {/* Display search results */}
              {providerSearchResults.length > 0 && (
                <div className="mt-2 border p-2 rounded">
                  <p className="text-gray-700 font-medium mb-2">
                    পাওয়া সেবা প্রদানকারী:
                  </p>
                  {providerSearchResults.map((provider) => (
                    <div
                      key={provider.id}
                      className="p-2 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <div className="text-gray-800">
                        {provider.name} ({provider.email || provider.phone})
                      </div>
                      {/* Button to select this provider */}
                      <button
                        type="button"
                        onClick={() => handleSelectProvider(provider)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                      >
                        নির্বাচন করুন
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Show selected provider */}
              {selectedProvider && (
                <div className="mt-2 p-2 border rounded bg-green-50">
                  <p className="text-gray-800 font-medium">সেবা প্রদানকারী:</p>
                  <p className="text-gray-800 font-extrabold">
                    {selectedProvider.name}
                  </p>
                </div>
              )}
            </div>

            {/* সেবার ধরন নির্বাচন করুন */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                সেবার ধরন নির্বাচন করুন
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
              >
                <option value="">সেবা নির্বাচন করুন</option>
                <option value="freelancer">ফ্রিল্যান্সার পেমেন্ট</option>
                <option value="business">বিজনেস ট্রান্সেকশন</option>
                <option value="ecommerce">ই-কমার্স লেনদেন</option>
                <option value="passport">পাসপোর্ট সংক্রান্ত লেনদেন</option>
                <option value="visa">ভিসা চুক্তি ও পেমেন্ট</option>
                <option value="foreign">বিদেশ গমন চুক্তি</option>
              </select>
            </div>

            {/* চুক্তির বিবরণ */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                চুক্তির বিবরণ
              </label>
              <textarea
                name="contractDetails"
                value={formData.contractDetails}
                onChange={handleChange}
                required
                rows="3"
                placeholder="চুক্তির বিস্তারিত তথ্য লিখুন..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
              ></textarea>
            </div>

            {/* পরিমাণ (টাকা) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                পরিমাণ (টাকা)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="আপনার লেনদেনের পরিমাণ লিখুন"
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
              />
            </div>

            {/* নির্ধারিত সময়সীমা */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                নির্ধারিত সময়সীমা
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
              />
            </div>

            {/* ডকুমেন্ট সংযুক্ত করুন */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                ডকুমেন্ট সংযুক্ত করুন (যদি থাকে)
              </label>
              <input
                type="file"
                name="documents"
                onChange={handleFileChange}
                multiple
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-800"
              />
            </div>

            {/* ভয়েস ইনপুট (আপনার লেনদেনের সার সংক্ষেপ) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                ভয়েস ইনপুট (আপনার লেনদেনের সার সংক্ষেপ)
              </label>
              <div className="flex flex-col space-y-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    রেকর্ড শুরু করুন
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    রেকর্ড বন্ধ করুন
                  </button>
                )}
                {isRecording && (
                  <p className="text-sm text-gray-600">
                    রেকর্ডিং চলছে: {recordingTime} সেকেন্ড বাকি...
                  </p>
                )}
                {audioURL && (
                  <div>
                    <p className="text-gray-700 mb-2">
                      রেকর্ড করা ভয়েস প্লে করুন:
                    </p>
                    <audio controls src={audioURL} className="w-full" />
                  </div>
                )}
                <p className="text-gray-600 text-sm">
                  আপনি ১ মিনিটের জন্য ভয়েস ইনপুট প্রদান করতে পারবেন।
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-6 py-3 text-white rounded-lg text-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark transition"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "তথ্যসমূহ পাঠানো হচ্ছে..."
                : "সাবমিট ( সেবা প্রদানকারীর কাছে পাঠান ) "}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

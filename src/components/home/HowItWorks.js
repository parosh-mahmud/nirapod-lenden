export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          কিভাবে কাজ করে?
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary">1. পেমেন্ট করুন</h3>
            <p className="mt-2 text-gray-600">
              সার্ভিস রিসিভার প্রথমে আমাদের প্লাটফর্মে পেমেন্ট করবেন।
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary">
              2. সার্ভিস সম্পন্ন করুন
            </h3>
            <p className="mt-2 text-gray-600">
              সার্ভিস প্রোভাইডার নির্ধারিত সময়ে সার্ভিস সম্পন্ন করবেন।
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary">3. পেমেন্ট রিলিজ</h3>
            <p className="mt-2 text-gray-600">
              সার্ভিস রিসিভার নিশ্চিত হলে, সার্ভিস প্রোভাইডার পেমেন্ট পাবেন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

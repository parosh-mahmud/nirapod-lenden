import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-background text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          নিরাপদ লেনদেন <span className="text-primary">নিশ্চিত করুন</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          সার্ভিস রিসিভার এবং সার্ভিস প্রোভাইডারের মধ্যস্থতাকারী হিসাবে, আমরা
          নিশ্চিন্তে পেমেন্ট প্রসেস সম্পন্ন করি।
        </p>
        <Link href="/services">
          <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-orange-600 transition">
            আমাদের সেবা দেখুন
          </button>
        </Link>
      </div>
    </section>
  );
}

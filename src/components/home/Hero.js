import Link from "next/link";
import { useRouter } from "next/router";
export default function Hero() {
  const router = useRouter();
  return (
    <section className="bg-background text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          নিরাপদে লেনদেন <span className="text-primary">নিশ্চিত করুন</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          "সেবা গ্রহণকারী এবং সেবা প্রদানকারীর মধ্যে নির্ভরযোগ্য মধ্যস্থতাকারী
          হিসেবে, আমরা শতভাগ নিশ্চিত ও নিরাপদ পেমেন্ট প্রসেসিং সুবিধা প্রদান
          করি।"
        </p>

        <Link href="/transactionForm">
          <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-orange-600 transition">
            লেনদেন শুরু করুন
          </button>
        </Link>
      </div>
    </section>
  );
}

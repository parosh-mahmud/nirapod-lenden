export default function Services() {
  const services = [
    {
      title: "ফ্রিল্যান্সার পেমেন্ট",
      description:
        "ফ্রিল্যান্সারদের জন্য দ্রুত ও নিরাপদ পেমেন্ট প্রসেসিং, কোনো ঝামেলা ছাড়াই।",
    },
    {
      title: "বিজনেস ট্রান্সেকশন",
      description:
        "ব্যবসায়িক লেনদেনকে সহজ ও নিরাপদ করার জন্য আমাদের নির্ভরযোগ্য সমাধান।",
    },
    {
      title: "ই-কমার্স পেমেন্ট গেটওয়ে",
      description:
        "ক্রেতা-বিক্রেতার মধ্যে বিশ্বাসযোগ্য ও নিরাপদ পেমেন্ট ফ্লো নিশ্চিত করি।",
    },
    {
      title: "পাসপোর্ট সংক্রান্ত লেনদেন",
      description:
        "নতুন পাসপোর্ট আবেদন, নবায়ন এবং সংশোধন পেমেন্ট সহজ ও ঝুঁকিমুক্ত।",
    },
    {
      title: "ভিসা চুক্তি ও পেমেন্ট",
      description:
        "বিদেশ গমন, চাকরি, শিক্ষা ও অন্যান্য উদ্দেশ্যে ভিসা চুক্তির পেমেন্ট নিরাপদ করুন।",
    },
    {
      title: "বিদেশ গমন চুক্তি লেনদেন",
      description:
        "কনট্রাক্ট-বেসড ভ্রমণ, চাকরি বা পড়াশোনার চুক্তিগত লেনদেন সহজ ও স্বচ্ছভাবে পরিচালনা করুন।",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          আমাদের সেবা সমূহ
        </h2>
        <p className="text-gray-600 mt-2">
          নিরাপদ ও স্বচ্ছ লেনদেনের জন্য আমাদের বিশেষায়িত সেবা গ্রহণ করুন।
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-primary">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

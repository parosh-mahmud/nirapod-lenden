export default function Services() {
  const services = [
    {
      title: "ফ্রিল্যান্সার পেমেন্ট",
      description: "ফ্রিল্যান্সারদের জন্য নিরাপদ পেমেন্ট প্রসেসিং।",
    },
    {
      title: "বিজনেস ট্রান্সেকশন",
      description: "বিভিন্ন ব্যবসার নিরাপদ লেনদেন।",
    },
    {
      title: "ই-কমার্স",
      description: "ক্রেতা-বিক্রেতার মধ্যে নিরাপদ পেমেন্ট ফ্লো।",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-white-800">আমাদের সেবা</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
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

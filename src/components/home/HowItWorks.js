// import { FaMoneyBillWave, FaTasks, FaCheckCircle } from "react-icons/fa";

// export default function HowItWorks() {
//   const steps = [
//     {
//       title: "পেমেন্ট করুন",
//       description:
//         "সেবা গ্রহণকারী প্রথমে আমাদের প্লাটফর্মে একটি ফরম ফিলাপ এর মাধ্যমে চুক্তির বিবরণ,সময় এবং  পেমেন্ট এমাউন্ট নির্ধারণ করে ফরমটি সেবা প্রদানকারী বাক্তির কাছে সাবমিট করবেন। সেবা প্রদানকারী বাক্তি ফরমটি ভালোভাবে দেখে চুক্তি গ্রহন অথবা বাতিল করবে পারবেন। যদি চুক্তি গ্রহন করেন তাহলে পুনরায় ফরমটি সাবমিট করবেন এরপর সেবা গ্রহণকারী বাক্তি চুক্তি অনুসারে নিরধারিত এমাউন্ট আমাদের কাছে জমা করবেন।",
//       icon: <FaMoneyBillWave className="text-4xl text-primary mx-auto mb-4" />,
//     },
//     {
//       title: "সেবা সম্পন্ন করুন",
//       description:
//         "সেবা প্রদানকারী নির্ধারিত সময়ে এবং চুক্তি অনুযায়ী কাজ সম্পন্ন করবেন।",
//       icon: <FaTasks className="text-4xl text-primary mx-auto mb-4" />,
//     },
//     {
//       title: "পেমেন্ট রিলিজ",
//       description:
//         "সেবা প্রদানকারীর কাঙ্খিত সেবা নিশ্চিত হলে, সেবা গ্রহণকারী পেমেন্ট পাবেন।",
//       icon: <FaCheckCircle className="text-4xl text-primary mx-auto mb-4" />,
//     },
//   ];

//   return (
//     <section className="py-16 bg-gray-100">
//       <div className="container mx-auto px-6 text-center">
//         <h2 className="text-3xl font-semibold text-gray-800 mb-6">
//           কিভাবে লেনদেন সম্পন্ন হবে?
//         </h2>
//         <p className="text-gray-600 mb-8">
//           আমাদের প্ল্যাটফর্ম ব্যবহার করে নিরাপদ ও নিশ্চিত লেনদেন করুন তিনটি সহজ
//           ধাপে।
//         </p>
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {steps.map((step, index) => (
//             <div
//               key={index}
//               className="p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
//             >
//               {step.icon}
//               <h3 className="text-xl font-bold text-primary">{step.title}</h3>
//               <p className="mt-2 text-gray-600">{step.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { FaTasks, FaFileContract, FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      title: "চুক্তি ও অর্থপ্রদান",
      description:
        "সেবা গ্রহণকারী প্রথমে আমাদের প্ল্যাটফর্মে একটি ফরম পূরণ করে চুক্তির বিবরণ, সময়সীমা, ও পেমেন্ট পরিমাণ নির্ধারণ করবেন। ফরমটি সেবা প্রদানকারীর কাছে পাঠানো হবে, যেখানে তিনি চুক্তি গ্রহণ বা বাতিল করার সুযোগ পাবেন। চুক্তি গ্রহণ হলে, নির্ধারিত অর্থ আমাদের প্ল্যাটফর্মে নিরাপদে জমা করা হবে।",
      icon: <FaFileContract className="text-4xl text-primary mx-auto mb-4" />,
    },
    {
      title: "সেবা প্রদান",
      description:
        "সেবা প্রদানকারী চুক্তির শর্ত অনুযায়ী নির্ধারিত সময়ের মধ্যে সেবা সম্পন্ন করবেন। প্ল্যাটফর্মের মাধ্যমে উভয় পক্ষ কাজের অগ্রগতি পর্যবেক্ষণ করতে পারবেন।",
      icon: <FaTasks className="text-4xl text-primary mx-auto mb-4" />,
    },
    {
      title: "নিরাপদ পেমেন্ট রিলিজ",
      description:
        "সেবা গ্রহণকারী সেবা সম্পন্ন হওয়ার পর সন্তুষ্ট হলে চূড়ান্ত অনুমোদন দেবেন। অনুমোদনের পর, প্ল্যাটফর্মের মাধ্যমে সেবা প্রদানকারীর কাছে পেমেন্ট স্থানান্তর করা হবে। যদি কোনো সমস্যা থাকে, প্ল্যাটফর্মের সমাধান ব্যবস্থা কার্যকর হবে।",
      icon: <FaCheckCircle className="text-4xl text-primary mx-auto mb-4" />,
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          কিভাবে লেনদেন সম্পন্ন করা হবে?
        </h2>
        <p className="text-gray-600 mb-8">
          আমাদের প্ল্যাটফর্ম ব্যবহার করে নিরাপদ লেনদেন নিশ্চিত করুন তিনটি সহজ
          ধাপে।
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            >
              {step.icon}
              <h3 className="text-xl font-bold text-primary">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

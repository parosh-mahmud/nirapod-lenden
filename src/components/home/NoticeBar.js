import { FaVolumeUp } from "react-icons/fa";

export default function NoticeBar() {
  return (
    <div className="w-full bg-primary text-white py-2 overflow-hidden flex items-center">
      {/* Voice Icon */}
      <FaVolumeUp className="text-xl ml-4 animate-pulse flex-shrink-0" />

      {/* Running Text */}
      <div className="marquee">
        <p className="whitespace-nowrap text-lg font-semibold tracking-wide">
          প্রতারকদের দিন শেষ, নিরাপদ লেনদেনের বাংলাদেশ। আপনার যেকোনো ধরনের
          লেনদেনের নিরাপত্তা নিশ্চিত করতে আমরা আছি আপনার পাশে। সেবা প্রদানকারী
          এবং সেবা গ্রহণকারী উভয়ের জন্যই আমাদের প্ল্যাটফর্মটি নিশ্চিন্তে ব্যবহার
          করতে পারেন।
        </p>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        .marquee {
          display: flex;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          padding-left: 20px;
          min-width: 100%;
        }

        @keyframes marquee {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

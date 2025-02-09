import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold text-white">নিরাপদ লেনদেন</h2>
          <p className="text-sm mt-2">
            আমরা আপনার লেনদেন নিরাপদ এবং নির্ভরযোগ্য করতে কাজ করছি।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">দ্রুত লিংক</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="/" className="hover:text-primary transition">
                হোম
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition">
                আমাদের সম্পর্কে
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-primary transition">
                সেবা
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                যোগাযোগ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">যোগাযোগ</h3>
          <p className="mt-2">📍 ঢাকা, বাংলাদেশ</p>
          <p>📞 +880 1712 345678</p>
          <p>📧 support@nirapodlenden.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center">
        <p className="text-sm">
          &copy; ২০২৫ নিরাপদ লেনদেন। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}

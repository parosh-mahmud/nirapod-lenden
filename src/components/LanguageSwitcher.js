// components/LanguageSwitcher.js
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const changeLanguage = (newLocale) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  return (
    <div className="flex space-x-2">
      {locales.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 border rounded ${
            locale === lng ? "bg-primary text-white" : "bg-white text-gray-800"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

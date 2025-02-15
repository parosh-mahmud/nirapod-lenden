import "@/styles/global.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthProvider";
import { ModalProvider } from "@/context/ModalContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SupportChat from "@/components/admin/SupportChat";
import nookies from "nookies";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = nookies.get(null).token;

  //     // Redirect non-authenticated users trying to access admin pages
  //     if (!token && isAdminRoute) {
  //       router.push("/admin/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router.pathname]);

  return (
    <AuthProvider>
      <ModalProvider>
        <Header />
        <main className="min-h-screen">
          <Component {...pageProps} />
          <SupportChat />
        </main>
        <Footer />
      </ModalProvider>
    </AuthProvider>
  );
}

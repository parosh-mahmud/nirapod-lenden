import "@/styles/global.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ModalProvider } from "@/context/ModalContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SupportChat from "@/components/admin/SupportChat";

export default function MyApp({ Component, pageProps }) {
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

import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Services from "@/components/home/Services";
import NoticeBar from "@/components/home/NoticeBar";
export default function Home() {
  return (
    <>
      <NoticeBar />
      <Hero />
      <HowItWorks />
      <Services />
    </>
  );
}

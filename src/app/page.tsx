import Navbar from "@/src/components/Navbar";
import HeroSection from "@/src/components/HeroSection";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

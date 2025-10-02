import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RewardsSection from "@/components/RewardsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <div id="tube-return">
        <HowItWorks />
      </div>
      <div id="rewards">
        <RewardsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

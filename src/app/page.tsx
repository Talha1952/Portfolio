import Hero from "@/components/Hero";
import BusinessSolutions from "@/components/BusinessSolutions";
import Projects from "@/components/Projects";
import EstimatoBot from "@/components/Estimato/EstimatoBot";
import Footer from "@/components/Footer";
import TouchParticles from "@/components/TouchParticles";

export default function Home() {
  return (
    <main>
      <TouchParticles />
      <Hero />
      <BusinessSolutions />
      <Projects />
      <EstimatoBot />
      <Footer />
    </main>
  );
}

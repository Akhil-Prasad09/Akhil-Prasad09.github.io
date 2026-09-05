import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Stones } from "@/components/sections/Stones";
import { Journey } from "@/components/sections/Journey";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Capabilities } from "@/components/sections/Capabilities";
import { Benchmarks } from "@/components/sections/Benchmarks";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Stones />
        <Journey />
        <TechMarquee />
        <Capabilities />
        <Benchmarks />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

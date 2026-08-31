import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Work } from "@/components/sections/Work";
import { MediaBridge } from "@/components/sections/MediaBridge";
import { Experience } from "@/components/sections/Experience";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Capabilities } from "@/components/sections/Capabilities";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Work />
        <MediaBridge />
        <Experience />
        <TechMarquee />
        <Capabilities />
      </main>
      <Footer />
    </>
  );
}

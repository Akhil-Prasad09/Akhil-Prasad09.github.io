import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Work />
      </main>
      <Footer />
    </>
  );
}

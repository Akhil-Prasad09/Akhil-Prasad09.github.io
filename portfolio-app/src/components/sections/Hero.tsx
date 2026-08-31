import SplitText from "@/components/bits/SplitText";
import TextType from "@/components/bits/TextType";
import SpecularButton from "@/components/bits/SpecularButton";
import BorderGlow from "@/components/bits/BorderGlow";
import { profile } from "@/data/content";
import { HeroSilk } from "./HeroSilk";

export function Hero() {
  return (
    <section className="relative grid min-h-[100dvh] grid-cols-1 items-center gap-10 overflow-hidden px-4 pb-16 pt-20 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:px-8 lg:pt-24">
      <HeroSilk />

      <div className="relative z-10 flex flex-col gap-6">
        <SplitText
          tag="h1"
          text="Building AI systems that ship."
          textAlign="left"
          className="text-5xl tracking-tighter leading-none text-ink md:text-6xl"
        />

        <TextType
          as="p"
          text={[
            "LLM pipelines in production.",
            "Vision models at 30 FPS.",
            "Benchmarks for frontier agents.",
          ]}
          typingSpeed={45}
          pauseDuration={2000}
          loop
          className="text-lg text-ink-dim md:text-xl"
        />

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* SpecularButton's API is a <button>, not a link; wrap it so the
              CTA still behaves like a real mailto link (right-click, ctrl-click). */}
          <a href={`mailto:${profile.email}`}>
            <SpecularButton
              size="lg"
              textColor="#fafafa"
              tint="#38bdf8"
              tintOpacity={0.1}
              lineColor="#38bdf8"
              autoAnimate
            >
              Get in touch
            </SpecularButton>
          </a>
          <a
            href="#work"
            className="inline-flex items-center rounded-full border border-ink-dim px-6 py-3 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            View work
          </a>
        </div>
      </div>

      <div className="relative z-10 hidden lg:block">
        <BorderGlow
          borderRadius={20}
          glowColor="198 93 60"
          glowIntensity={0.4}
          backgroundColor="#131316"
          className="p-8"
        >
          <div className="font-mono text-sm">
            <p className="text-ink">{profile.name}</p>
            <p className="mt-2 text-ink-dim">{profile.role}</p>
            <p className="mt-2 text-ink-dim">{profile.location}</p>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}

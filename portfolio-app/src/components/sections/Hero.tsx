import SplitText from "@/components/bits/SplitText";
import TextType from "@/components/bits/TextType";
import SpecularButton from "@/components/bits/SpecularButton";
import BorderGlow from "@/components/bits/BorderGlow";
import WebGLBoundary from "@/components/bits/WebGLBoundary";
import { profile } from "@/data/content";
import { HeroSilk } from "./HeroSilk";

// Real, measured numbers only (see each repo's README).
const HERO_DEMOS = [
  { name: "Emotion tracker", what: "Your webcam, a CNN, no upload", proof: "70.6% FER-2013", href: "https://akhil-prasad09.github.io/cag-emotion-tracker/" },
  { name: "E2EE chat", what: "Try to break it as the server", proof: "key-swap caught", href: "https://akhil-prasad09.github.io/e2ee-chat/" },
  { name: "Knee MRI", what: "Upload a scan, see Grad-CAM", proof: "AUC 0.943", href: "https://akhil-prasad09.github.io/knee-mri-detect/" },
  { name: "Gesture controller", what: "Play music with your hand", proof: "MediaPipe", href: "https://akhil-prasad09.github.io/gesture-media-controller/" },
];

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
              CTA still behaves like a real mailto link (right-click, ctrl-click).
              The inner button is aria-hidden + untabbable so the anchor (with its
              own aria-label) is the single control in the a11y tree and tab order. */}
          {/* inline-flex, not inherited blockification: as a flex item this
              anchor happens to be blockified already, but the focus ring must
              wrap the button regardless of what the parent's display is. */}
          <a
            href={`mailto:${profile.email}`}
            aria-label="Get in touch"
            className="inline-flex"
          >
            {/* SpecularButton paints its face in WebGL, so its fallback has to
                carry the visible label; the anchor around it is what actually
                works either way. */}
            <WebGLBoundary
              fallback={
                <span className="inline-flex items-center rounded-full border border-accent px-6 py-3 text-ink">
                  Get in touch
                </span>
              }
            >
              <SpecularButton
                size="lg"
                textColor="#fafafa"
                tint="#38bdf8"
                tintOpacity={0.1}
                lineColor="#38bdf8"
                autoAnimate
                tabIndex={-1}
                ariaHidden
              >
                Get in touch
              </SpecularButton>
            </WebGLBoundary>
          </a>
          <a
            href="#work"
            className="inline-flex items-center rounded-full border border-ink-dim px-6 py-3 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            View work
          </a>
        </div>
      </div>

      <div className="relative z-10">
        <BorderGlow
          borderRadius={20}
          glowColor="198 93 60"
          glowIntensity={0.4}
          backgroundColor="#131316"
          className="p-6 md:p-8"
        >
          <p className="text-ink">{profile.name}</p>
          <p className="mt-1 text-sm text-ink-dim">{profile.role} {profile.location}.</p>
          <h2 className="mt-6 text-sm font-medium text-ink">Try it live, in your browser</h2>
          <ul className="mt-3 divide-y divide-white/10">
            {HERO_DEMOS.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-4 py-3 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  <span>
                    <span className="text-ink transition-colors group-hover:text-accent">{d.name}</span>
                    <span className="block text-sm text-ink-dim">{d.what}</span>
                  </span>
                  <span className="shrink-0 font-mono text-sm text-accent">{d.proof} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </BorderGlow>
      </div>
    </section>
  );
}

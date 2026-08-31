# Akhil Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Akhil's dark, high-motion portfolio (Next.js static export) implementing the approved spec at `docs/superpowers/specs/2026-09-01-portfolio-design.md`, fully data-driven so new projects and certifications are added by editing one file.

**Architecture:** Single-page Next.js 15 App Router site, static export. All content in `src/data/content.ts` (typed). Sections are server components mapping over data; every animated piece is an isolated `'use client'` leaf from React Bits (`TS-TW` variants, retinted azure) or hand-rolled Motion springs (project sheet). Generative poster assets are HTML compositions captured to webp by a script.

**Tech Stack:** Next.js 15, React 19, Tailwind v4, `motion` (motion/react), React Bits TS-TW, `@phosphor-icons/react`, Geist via `next/font`.

## Global Constraints

Copied from the spec; every task inherits these.

- Theme: dark-locked everywhere. Base `zinc-950`. Never pure `#000000` or `#ffffff`.
- Accent: `#38BDF8` (azure) only. Retint every React Bits component; no default purple anywhere.
- Radius: cards `rounded-[20px]`, pills `rounded-full`, inputs `rounded-[10px]`. No other radii.
- Fonts: Geist + Geist Mono via `next/font`. No Inter.
- Icons: `@phosphor-icons/react` only, `weight="regular"`.
- ZERO em-dash or en-dash characters in any visible string. Hyphen only. (Mechanical check in Task 12; also self-check every string you write.)
- Max 4 uppercase-tracking eyebrow labels across the whole page. Zero scroll cues, zero section-number labels, zero decorative dots, one marquee total.
- One CTA intent per label: the contact CTA label is exactly "Get in touch" everywhere it appears (hero + contact). Portfolio CTA label is exactly "View work" (hero secondary, scrolls to #work).
- Every animation above hover-level must degrade under `prefers-reduced-motion` (use `useReducedMotion` from `motion/react` or CSS media query).
- Continuous pointer/drag values: `useMotionValue`/`useTransform`, never `useState`.
- `min-h-[100dvh]` never `h-screen`. No `window.addEventListener('scroll')` anywhere.
- Static export (`output: 'export'`). No API routes, no forms.
- Data-driven rule: sections NEVER hardcode content. If a task needs a string of content, it must come from `src/data/content.ts`. Adding a project or certification must require editing only that file.
- Commit after every task (steps say when).
- Node 24 is installed. Working dir for all commands: repo root `/Users/akhil/Akhil's Files/Portfolio` (quote the path in shell).

## File Structure

```
portfolio-app/                  # Next.js app lives in subdir (repo root holds docs/)
  next.config.ts
  postcss.config.mjs
  src/
    app/
      layout.tsx                # fonts, dark lock, Noise overlay, metadata
      page.tsx                  # composes all sections in order
      globals.css               # Tailwind v4 import + tokens (@theme)
    data/
      content.ts                # THE content file (types + data)
    lib/
      z.ts                      # z-index scale constants
      motion.ts                 # shared spring configs + project() helper
    components/
      bits/                     # vendored React Bits (installed, then retinted)
      sections/
        Nav.tsx  Hero.tsx  Metrics.tsx  Work.tsx  ProjectSheet.tsx
        MediaBridge.tsx  Experience.tsx  TechMarquee.tsx  Capabilities.tsx
        Benchmarks.tsx  Education.tsx  Contact.tsx  Footer.tsx
      media/
        NeuralFlow.tsx          # generative canvas for media bridge
        posters/index.html      # poster compositions for capture
  public/media/                 # captured webp posters + real project assets
  scripts/
    capture-posters.mjs         # HTML -> webp via headless Chrome
    check-output.mjs            # post-build assertions (content + em-dash)
```

---

### Task 1: Scaffold app, theme tokens, layout shell

**Files:**
- Create: `portfolio-app/` via create-next-app; `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/z.ts`, `next.config.ts` (modify generated)

**Interfaces:**
- Produces: `Z` const object from `src/lib/z.ts` (`{ nav: 40, sheet: 50, grain: 60 }`); CSS custom props `--accent`, `--surface`, `--surface-2`; app builds statically to `out/`.

- [ ] **Step 1: Scaffold**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio"
npx create-next-app@latest portfolio-app --ts --tailwind --app --src-dir --no-eslint --use-npm --yes
cd portfolio-app && npm i motion @phosphor-icons/react
```

- [ ] **Step 2: Static export config**

Replace `next.config.ts` content:

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};
export default nextConfig;
```

(`images.unoptimized` is required for `next/image` under static export.)

- [ ] **Step 3: Tokens in globals.css**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-accent: #38bdf8;
  --color-surface: #09090b;      /* zinc-950 */
  --color-surface-2: #131316;
  --color-ink: #fafafa;          /* zinc-50, not pure white */
  --color-ink-dim: #a1a1aa;      /* zinc-400 */
  --radius-card: 20px;
  --radius-input: 10px;
}

html { color-scheme: dark; }
body { background: var(--color-surface); color: var(--color-ink); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: z-scale**

Create `src/lib/z.ts`:

```ts
export const Z = { nav: 40, sheet: 50, grain: 60 } as const;
```

- [ ] **Step 5: Layout with fonts**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Akhil Prasad",
  description: "AI/ML engineer building LLM and computer vision systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Placeholder page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return <main className="min-h-[100dvh]" />;
}
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: succeeds, `out/index.html` exists.

- [ ] **Step 8: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio"
printf 'portfolio-app/node_modules/\nportfolio-app/.next/\nportfolio-app/out/\n' >> .gitignore
git add -A && git commit -m "feat: scaffold Next.js app with dark theme tokens"
```

---

### Task 2: Content data layer (the extensibility contract)

**Files:**
- Create: `portfolio-app/src/data/content.ts`
- Test: `portfolio-app/scripts/check-content.mjs`

**Interfaces:**
- Produces (exact, later tasks import these):

```ts
export type Tier = "featured" | "compact";
export type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "gif"; src: string; alt: string }
  | { kind: "poster"; src: string; alt: string };  // code-generated webp
export interface Project {
  slug: string; title: string; tagline: string;    // tagline <= 12 words
  year: string; tier: Tier; tags: string[];
  metrics: { label: string; value: string }[];     // real numbers only
  body: string[];                                   // sheet paragraphs, <= 3
  media: Media[];                                   // first item = card image
  links: { label: string; href: string }[];
}
export interface Role {
  org: string; title: string; period: string; location: string;
  points: string[];                                 // <= 3, <= 25 words each
}
export interface Certification { name: string; issuer: string; date: string }
export interface Stat { label: string; value: number; suffix: string; decimals?: number }
export const profile: { name: string; role: string; location: string;
  email: string; github: string; linkedin: string; resumePath: string };
export const stats: Stat[];
export const projects: Project[];      // ORDER = display order; tier drives cell size
export const roles: Role[];            // ORDER = display order (newest first)
export const certifications: Certification[];
export const skills: string[];         // marquee items
export const capabilities: { title: string; items: string[] }[];  // exactly 4 clusters
```

- Adding a future project/cert = append to the relevant array. Nothing else.

- [ ] **Step 1: Write the check script (fails first)**

Create `portfolio-app/scripts/check-content.mjs`:

```js
import { projects, certifications, roles, stats, capabilities } from "../src/data/content.js";
// Run via tsx; assertions below are the acceptance contract.
const assert = (c, msg) => { if (!c) { console.error("FAIL:", msg); process.exit(1); } };
assert(projects.length === 7, "7 projects");
assert(projects.filter(p => p.tier === "featured").length === 2, "2 featured");
assert(new Set(projects.map(p => p.slug)).size === projects.length, "unique slugs");
assert(roles.length === 4, "4 roles");
assert(certifications.length === 2, "2 certifications");
assert(capabilities.length === 4, "4 capability clusters");
assert(stats.length >= 4, "at least 4 stats");
for (const p of projects) {
  assert(p.media.length >= 1, `${p.slug}: needs at least one media item`);
  assert(p.body.length <= 3 && p.body.length >= 1, `${p.slug}: 1-3 body paragraphs`);
}
const banned = /[—–]/;
const scan = (o, path) => {
  if (typeof o === "string") assert(!banned.test(o), `em/en-dash in ${path}: ${o}`);
  else if (Array.isArray(o)) o.forEach((v, i) => scan(v, `${path}[${i}]`));
  else if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => scan(v, `${path}.${k}`));
};
scan({ projects, certifications, roles, stats, capabilities }, "content");
console.log("content OK");
```

Run: `cd portfolio-app && npx tsx scripts/check-content.mjs`
Expected: FAIL (module not found).

- [ ] **Step 2: Write content.ts**

Create `portfolio-app/src/data/content.ts` with the interfaces above and this data (copy verbatim; source: resume + LinkedIn pull in the spec):

```ts
export const profile = {
  name: "Akhil Prasad Chinthala",
  role: "AI/ML engineer. LLM and computer vision systems.",
  location: "Hyderabad, India",
  email: "prasadakhil0909@gmail.com",
  github: "https://github.com/Akhil-Prasad09",
  linkedin: "https://www.linkedin.com/in/akhil-prasad-972043289/",
  resumePath: "/Akhil_Prasad_Resume.pdf",
};

export const stats: Stat[] = [
  { label: "FER-2013 accuracy", value: 90, suffix: "%+" },
  { label: "inference latency", value: 50, suffix: "ms", decimals: 0 },
  { label: "benchmark tasks shipped", value: 21, suffix: "" },
  { label: "stations analyzed", value: 39, suffix: "" },
  { label: "CGPA", value: 8.64, suffix: "", decimals: 2 },
];

export const projects: Project[] = [
  {
    slug: "knee-mri-detect", tier: "featured", year: "2026",
    title: "Knee MRI Detect",
    tagline: "Deep-learning abnormality detection on knee MRI for clinical decision support",
    tags: ["PyTorch", "EfficientNet-B3", "Grad-CAM", "FastAPI", "React", "Docker"],
    metrics: [
      { label: "Backbone", value: "EfficientNet-B3" },
      { label: "Dataset", value: "MRNet, 3 planes" },
    ],
    body: [
      "Trains per-plane EfficientNet-B3 classifiers on Stanford's MRNet dataset to flag abnormalities, ACL tears, and meniscus tears, with Grad-CAM heatmaps showing the model's evidence on each slice.",
      "Ships as a full product: FastAPI inference API, React viewer, PDF reporting via ReportLab, and a Docker compose stack with Postgres.",
      "Research and decision-support use only, not a medical device.",
    ],
    media: [
      { kind: "image", src: "/media/knee-gradcam-acl.png", alt: "Grad-CAM heatmap over a knee MRI slice highlighting the ACL region" },
      { kind: "image", src: "/media/knee-gradcam-meniscus.png", alt: "Grad-CAM heatmap over a knee MRI slice highlighting the meniscus" },
    ],
    links: [],
  },
  {
    slug: "ev-apm-agent", tier: "featured", year: "2026",
    title: "EV APM Agent",
    tagline: "Real-time fault detection and degradation tracking for EV charging fleets",
    tags: ["Python", "Anomaly detection", "Streaming", "Docker"],
    metrics: [
      { label: "Fleet", value: "39 stations" },
      { label: "Vendors", value: "5+" },
    ],
    body: [
      "A two-layer watchdog for EV charging networks: a rules engine catches known fault patterns instantly while a learning layer tracks each connector's normal behavior to flag drift before hard failure.",
      "Separates self-recovering blips from faults that need a technician, validated on real telemetry from 39 stations across five vendors. Deploys as a sidecar container next to an existing CMS.",
    ],
    media: [
      { kind: "gif", src: "/media/ev-selfrecovery.gif", alt: "Live decision trace of a self-recovery downgrade on real fleet data" },
      { kind: "image", src: "/media/ev-architecture.svg", alt: "EV APM Agent two-layer architecture diagram" },
      { kind: "image", src: "/media/ev-fpr-chart.png", alt: "False positive rate chart across detection categories" },
    ],
    links: [],
  },
  {
    slug: "cag-emotion-tracker", tier: "compact", year: "2025",
    title: "CAG Emotion Tracker",
    tagline: "Attention-guided emotion recognition at webcam speed",
    tags: ["PyTorch", "InceptionV3", "OpenCV"],
    metrics: [
      { label: "Accuracy", value: "90%+ on FER-2013" },
      { label: "Latency", value: "under 50ms" },
    ],
    body: [
      "Fine-tuned an attention-guided InceptionV3 on FER-2013 to 90%+ across seven emotion classes, well ahead of the baseline CNN.",
      "A cache-augmented pipeline batches inference and LRU-caches repeated frames, holding end-to-end latency under 50ms on live webcam input. Led a 3-person team through delivery.",
    ],
    media: [{ kind: "poster", src: "/media/emotion.webp", alt: "Emotion class activation poster" }],
    links: [],
  },
  {
    slug: "dentalbot", tier: "compact", year: "2025",
    title: "Booking Platform with Voice AI",
    tagline: "Live booking product with a voice assistant that converts visitors",
    tags: ["React", "Vite", "Express", "Web Speech API"],
    metrics: [{ label: "Status", value: "Live for a real client" }],
    body: [
      "End-to-end booking web app for a real business client, handling genuine customer bookings: React/Vite frontend on an Express REST API.",
      "A voice-enabled assistant answers service FAQs and converts visitors into bookings. The workflow automates through to Google Sheets sync and email confirmations.",
    ],
    media: [{ kind: "poster", src: "/media/dentalbot.webp", alt: "Voice waveform poster" }],
    links: [],
  },
  {
    slug: "gesture-controller", tier: "compact", year: "2024",
    title: "Hand-Gesture Media Controller",
    tagline: "Touchless macOS media control from hand landmarks",
    tags: ["MediaPipe", "OpenCV", "AppleScript"],
    metrics: [
      { label: "Frame rate", value: "30 FPS" },
      { label: "Response", value: "under 20ms" },
    ],
    body: [
      "Maps MediaPipe hand-landmark detection to macOS volume and playback controls for fully touchless media operation, sustaining 30 FPS with sub-20ms gesture response.",
    ],
    media: [{ kind: "poster", src: "/media/gesture.webp", alt: "Hand landmark constellation poster" }],
    links: [],
  },
  {
    slug: "encrypted-chat", tier: "compact", year: "2025",
    title: "Encrypted Chat Application",
    tagline: "End-to-end encrypted desktop chat with a multithreaded server",
    tags: ["Python", "PyQt5", "Sockets", "SQLite", "AES"],
    metrics: [{ label: "Encryption", value: "AES end-to-end" }],
    body: [
      "Real-time desktop messaging with end-to-end AES encryption, a multithreaded socket server for concurrent users, persistent SQLite history, and online status tracking behind an animated PyQt5 UI.",
    ],
    media: [{ kind: "poster", src: "/media/chatapp.webp", alt: "Encrypted stream poster" }],
    links: [],
  },
  {
    slug: "green-basket", tier: "compact", year: "2024",
    title: "Green Basket",
    tagline: "Vanilla JavaScript storefront with a full checkout flow",
    tags: ["JavaScript", "HTML5", "CSS3"],
    metrics: [],
    body: [
      "Responsive grocery storefront in vanilla JavaScript: dynamic filtering, cart state management, and a complete checkout flow, no framework.",
    ],
    media: [{ kind: "poster", src: "/media/greenbasket.webp", alt: "Produce grid poster" }],
    links: [],
  },
];

export const roles: Role[] = [
  {
    org: "AMIK Technologies", title: "AI Engineering Intern",
    period: "Apr 2026 - Present", location: "Hyderabad, hybrid",
    points: [
      "Builds production RAG pipelines over internal documents, replacing manual lookup with grounded, citation-backed answers.",
      "Ships an automated evaluation harness scoring retrieval relevance, faithfulness, and latency across model and prompt versions.",
      "Serves models behind FastAPI endpoints with token streaming, cost logging, and provider fallback.",
    ],
  },
  {
    org: "Handshake AI", title: "Freelance AI Trainer",
    period: "Jul 2026 - Present", location: "Remote",
    points: [
      "Authors terminal-based benchmark tasks used to evaluate frontier AI coding agents: 21 tasks across 7 domains.",
      "Ships each task as a reproducible package: spec, Dockerised environment, automated verifier, and reference solution.",
    ],
  },
  {
    org: "SkillCraft Technology", title: "Machine Learning Intern",
    period: "Late 2025", location: "Remote",
    points: ["One-month internship deepening applied machine learning on real-time projects."],
  },
  {
    org: "Oasis Infobyte", title: "Software Development Intern, Python",
    period: "2024", location: "Remote",
    points: [
      "Delivered five Python applications, each specified, built, and demoed independently.",
      "Highlights: a speech-recognition voice assistant, a REST-integrated weather CLI, and a multi-client TCP chat server.",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM", date: "Oct 2024" },
  { name: "Data Analytics Job Simulation", issuer: "Deloitte Australia via Forage", date: "Oct 2025" },
];

export const skills: string[] = [
  "Python", "PyTorch", "TensorFlow", "Hugging Face", "OpenCV", "MediaPipe",
  "RAG", "LLM evaluation", "Vector search", "FastAPI", "React", "Node.js",
  "SQL", "MongoDB", "Docker", "Linux", "Git",
];

export const capabilities = [
  { title: "LLM and generative AI", items: ["Retrieval-augmented generation", "Prompt engineering and structured outputs", "Embeddings and vector search", "LLM evaluation and semantic caching"] },
  { title: "Machine learning and CV", items: ["PyTorch and TensorFlow", "Fine-tuning and transfer learning", "OpenCV and MediaPipe", "Real-time inference optimization"] },
  { title: "Backend and serving", items: ["FastAPI model serving", "Token streaming and fallback", "Latency and cost profiling", "Docker and Linux"] },
  { title: "Web and data", items: ["React and Vite", "Node.js and Express", "MySQL and MongoDB", "Vector databases"] },
];
```

(Include the `Tier`, `Media`, `Project`, `Role`, `Certification`, `Stat` type declarations from the Interfaces block above the data.)

- [ ] **Step 3: Run check**

Run: `cd portfolio-app && npx tsx scripts/check-content.mjs`
Expected: `content OK`.

- [ ] **Step 4: Copy real assets + resume**

```bash
cd "/Users/akhil/Akhil's Files"
mkdir -p Portfolio/portfolio-app/public/media
cp "Major Project/knee-mri-detect/storage/6/gradcam_acl.png" Portfolio/portfolio-app/public/media/knee-gradcam-acl.png
cp "Major Project/knee-mri-detect/storage/6/gradcam_meniscus.png" Portfolio/portfolio-app/public/media/knee-gradcam-meniscus.png
cp "ET Hackathon/ev-apm-agent/docs/assets/hook_selfrecovery.gif" Portfolio/portfolio-app/public/media/ev-selfrecovery.gif
cp "ET Hackathon/ev-apm-agent/docs/architecture_v2.svg" Portfolio/portfolio-app/public/media/ev-architecture.svg
cp "ET Hackathon/ev-apm-agent/docs/assets/fpr_chart.png" Portfolio/portfolio-app/public/media/ev-fpr-chart.png
cp "Akhil_Prasad_Resume_clean.pdf" Portfolio/portfolio-app/public/Akhil_Prasad_Resume.pdf
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio"
git add -A && git commit -m "feat: typed content data layer with real assets"
```

---

### Task 3: Vendor React Bits components, retint azure

**Files:**
- Create: `portfolio-app/src/components/bits/*` (25 components)

**Interfaces:**
- Produces: importable components at `@/components/bits/<Name>` with React Bits' documented props. All color props/internals set to azure family (`#38bdf8` / `hsl(199 89% 60%)`), backgrounds `transparent` or `--color-surface`.

- [ ] **Step 1: Install via shadcn registry**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio/portfolio-app"
for c in PillNav StaggeredMenu Silk SplitText TextType SpecularButton CountUp MagicBento BorderGlow HalftoneReveal TiltedCard GlassSurface ScrollExpand ScrollStack ScrollVelocity SpotlightCard DecryptedText AnimatedList AnimatedContent ElasticMesh Beams GlassIcons ShinyText GradualBlur Noise; do
  npx shadcn@latest add "@react-bits/${c}-TS-TW" --yes || echo "MISSING: $c" >> ../missing-bits.txt
done
```

- [ ] **Step 2: Fallback for any MISSING entries**

For each name in `missing-bits.txt` (if it exists), fetch source directly from the repo and place it under `src/components/bits/<Name>/`:

```bash
curl -s "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/<Category>/<Name>/<Name>.tsx" -o "src/components/bits/<Name>.tsx"
```

Categories per the catalog: Animations = GradualBlur, Noise, HalftoneReveal, AnimatedContent, FadeContent, ElasticMesh(check), ScrollExpand(check); Backgrounds = Silk, Beams; Components = PillNav, StaggeredMenu, SpecularButton, MagicBento, BorderGlow, TiltedCard, GlassSurface, ScrollStack, SpotlightCard, AnimatedList, GlassIcons, Counter; TextAnimations = SplitText, TextType, CountUp, ScrollVelocity, DecryptedText, ShinyText. If a component's true category differs, list the repo dir first: `curl -s "https://api.github.com/repos/DavidHDev/react-bits/contents/src/ts-tailwind/<Category>"`.

- [ ] **Step 3: Normalize location**

Ensure all components live under `src/components/bits/` (move if shadcn placed them elsewhere, e.g. `components/ui/`). Fix relative imports after moving.

- [ ] **Step 4: Retint sweep**

```bash
grep -rniE "#(8B5CF6|A78BFA|7C3AED|C084FC|9333EA|6D28D9)|purple|violet" src/components/bits/ | cut -d: -f1 | sort -u
```

In every hit: replace purple/violet values with `#38bdf8` (or the design token via props where the component takes color props; prefer passing props at call sites, edit source only where colors are hardcoded). Also replace any pure `#000`/`#fff` with `#09090b`/`#fafafa`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: compiles. (Unused-component warnings fine; type errors not.)

- [ ] **Step 6: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: vendor React Bits components, retint to azure"
```

---

### Task 4: Shared motion lib + Nav + Footer

**Files:**
- Create: `src/lib/motion.ts`, `src/components/sections/Nav.tsx`, `src/components/sections/Footer.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`

**Interfaces:**
- Produces: `SPRING_DEFAULT` `{ type: "spring", bounce: 0, duration: 0.4 }`, `SPRING_MOMENTUM` `{ type: "spring", bounce: 0.2, duration: 0.35 }`, `project(velocity, decel?)` momentum-projection fn. `Nav` (client) and `Footer` (server) components, no props.

- [ ] **Step 1: motion.ts**

```ts
export const SPRING_DEFAULT = { type: "spring", bounce: 0, duration: 0.4 } as const;
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.35 } as const;
/** Apple momentum projection: where a flick would land. */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}
```

- [ ] **Step 2: Nav.tsx** (client leaf)

Use `PillNav` with items `[{label:"Work",href:"#work"},{label:"Experience",href:"#experience"},{label:"Contact",href:"#contact"}]` + brand text `profile.name.split(" ")[0]` from content. Wrap in `<header className="fixed inset-x-0 top-0" style={{ zIndex: Z.nav }}>` with `GradualBlur` (position top, small height) beneath it as the scroll-edge effect. Height cap: total header <= 72px. `StaggeredMenu` renders instead of `PillNav` below `md:` (conditional render via CSS `hidden md:block` / `md:hidden`, both mounted).

- [ ] **Step 3: Footer.tsx** (server)

```tsx
import { ShinyText } from "@/components/bits/ShinyText";
import { profile } from "@/data/content";
export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-dim">
      <ShinyText text={profile.name} speed={3} />
    </footer>
  );
}
```

(Adjust `ShinyText` prop names to the vendored component's actual API; keep sheen monochrome/azure.)

- [ ] **Step 4: Compose in page.tsx**

```tsx
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-[100dvh]" />
      <Footer />
    </>
  );
}
```

Add `Noise` overlay in `layout.tsx` body: `<div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 60 }}><Noise patternAlpha={12} /></div>` (tune alpha so grain is subtle).

- [ ] **Step 5: Verify + commit**

Run `npm run build`, then `python3 -m http.server 4173 -d out` and eyeball `http://localhost:4173` in Chrome (nav single line, footer sheen). Kill server.

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: nav, footer, grain overlay, motion lib"
```

---

### Task 5: Hero + Metrics strip

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/Metrics.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `stats` from content; `Silk`, `SplitText`, `TextType`, `SpecularButton`, `CountUp` from bits.
- Produces: `<Hero />`, `<Metrics />` server wrappers with client leaves inside.

- [ ] **Step 1: Hero.tsx**

Asymmetric split, left-weighted (`grid lg:grid-cols-[7fr_5fr]`), `min-h-[100dvh]` section with `Silk` as absolute background layer (azure tint, low speed/intensity, `opacity-40`). Left column, max 4 text elements:

1. Headline via `SplitText`: `"Building AI systems that ship."` (`text-5xl md:text-6xl tracking-tighter leading-none`, 2 lines max)
2. Subtext via `TextType` cycling `["LLM pipelines in production.", "Vision models at 30 FPS.", "Benchmarks for frontier agents."]` (`text-ink-dim`, under 20 words each)
3. CTAs: `SpecularButton` label `"Get in touch"` (href `mailto:` + profile.email) + ghost link `"View work"` (href `#work`, border pill, contrast-checked)

Right column: empty on mobile; on `lg:` a `BorderGlow`-wrapped card (radius 20) holding the name, role line, and location from `profile` in mono type. Hero top padding <= `pt-24`. No trust strips, no taglines below CTAs, no scroll cue.

- [ ] **Step 2: Metrics.tsx**

```tsx
import { stats } from "@/data/content";
import { CountUp } from "@/components/bits/CountUp";
export function Metrics() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-5">
        {stats.map(s => (
          <div key={s.label}>
            <dt className="text-sm text-ink-dim">{s.label}</dt>
            <dd className="font-mono text-3xl">
              <CountUp to={s.value} decimals={s.decimals ?? 0} duration={1.2} />{s.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

(Grid col count follows `stats.length`; use `md:grid-cols-5` while there are 5, or compute class from length if CountUp API differs, match vendored props.)

- [ ] **Step 3: Wire into page, build, visual check**

Add `<Hero />` and `<Metrics />` to `page.tsx`. `npm run build`; serve `out/`; verify: headline 2 lines, CTAs visible without scrolling at 1440x900 AND 375x667, CountUp animates once in view, reduced-motion shows final values (toggle via Chrome devtools rendering emulation).

- [ ] **Step 4: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: hero with silk background and metrics strip"
```

---

### Task 6: Work bento (data-driven cells)

Note: the spec names `MagicBento` for structure; this plan uses a plain CSS grid + `BorderGlow` per cell instead. Same visual outcome, one fewer dependency, and auto-flow is what makes future projects drop in with zero layout edits. Deliberate deviation.

**Files:**
- Create: `src/components/sections/Work.tsx`, `src/components/sections/WorkCell.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `projects`, types from content; `BorderGlow`, `HalftoneReveal`, `TiltedCard` from bits.
- Produces: `<Work />`; `WorkCell({ project, onOpen }: { project: Project; onOpen: (slug: string) => void })` client component that renders one cell and calls `onOpen(project.slug)` on click. Work owns `openSlug` state and renders `ProjectSheet` (Task 7) when set. Until Task 7 exists, clicking sets state and renders nothing (temporary `{/* sheet mounts here in next task */}`).

- [ ] **Step 1: Grid math (must scale with future projects)**

`Work.tsx` (client, owns sheet state):

```tsx
"use client";
import { useState } from "react";
import { projects } from "@/data/content";
import { WorkCell } from "./WorkCell";

export function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-24">
      <h2 className="mb-10 text-4xl tracking-tighter">Selected work</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-6 md:auto-rows-[minmax(180px,auto)]">
        {projects.map(p => (
          <WorkCell key={p.slug} project={p} onOpen={setOpenSlug} />
        ))}
      </div>
      {/* ProjectSheet mounts here in Task 7 */}
    </section>
  );
}
```

`WorkCell` spans by tier: featured `md:col-span-3 md:row-span-2`, compact `md:col-span-2`. With 2 featured + 5 compact on a 6-col grid: row 1 = two featured (3+3), rows 2-3 = compacts (2+2+2, then 2+2 with the last cell `md:col-start-3` optional; DO NOT special-case by index, just let grid auto-flow pack, `grid-flow-dense`). Any future appended project auto-flows; no empty cells because compact cells pack 3-per-row.

- [ ] **Step 2: WorkCell.tsx**

Wrap content in `BorderGlow` (`glowColor` azure HSL triplet, `glowIntensity={0.4}`, `borderRadius={20}`, background `--color-surface-2`). Inside: featured tier renders first media via `HalftoneReveal`-wrapped `next/image` (explicit width/height, `alt` from media), title, tagline, tag row (plain text, no dots); compact tier renders `TiltedCard` (small max tilt ~6deg) with poster image, title, tagline. Whole cell is a `<button>` (`onClick={() => onOpen(project.slug)}`, `aria-haspopup="dialog"`). `:active` scale `0.98`.

- [ ] **Step 3: Build + visual check**

`npm run build`, serve. Verify: 7 cells, no empty slots, glow follows pointer near edges, halftone reveals on scroll-into-view, keyboard focus ring visible on cells, mobile collapses to single column.

- [ ] **Step 4: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: data-driven work bento with border glow"
```

---

### Task 7: Project sheet (Apple physics centerpiece)

**Files:**
- Create: `src/components/sections/ProjectSheet.tsx`
- Modify: `src/components/sections/Work.tsx` (mount sheet)

**Interfaces:**
- Consumes: `Project` type, `Z`, `project()` + springs from `src/lib/motion.ts`, `GlassSurface`.
- Produces: `ProjectSheet({ project, onClose }: { project: Project; onClose: () => void })`.

- [ ] **Step 1: ProjectSheet.tsx**

Requirements (implement exactly):

```tsx
"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useReducedMotion, animate } from "motion/react";
import type { Project } from "@/data/content";
import { Z } from "@/lib/z";
import { project as projectMomentum } from "@/lib/motion";

const DISMISS_DISTANCE = 160;

export function ProjectSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  const scrimOpacity = useTransform(y, [0, 400], [1, 0.4]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  function handleDragEnd(_: unknown, info: { velocity: { y: number }; offset: { y: number } }) {
    const projected = info.offset.y + projectMomentum(info.velocity.y);
    if (projected > DISMISS_DISTANCE && info.velocity.y >= 0) {
      animate(y, window.innerHeight, { type: "spring", bounce: 0, duration: 0.3, velocity: info.velocity.y }).then(onClose);
    } else {
      animate(y, 0, { type: "spring", bounce: 0.2, duration: 0.4, velocity: info.velocity.y });
    }
  }

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={project.title}
      className="fixed inset-0" style={{ zIndex: Z.sheet }}>
      <motion.button aria-label="Close" onClick={onClose}
        className="absolute inset-0 bg-black/60" style={{ opacity: scrimOpacity }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div
        drag={reduce ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.15, bottom: 0.6 }}   /* rubber-band up, loose down */
        style={{ y }}
        onDragEnd={handleDragEnd}
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        className="absolute inset-x-0 bottom-0 top-16 overflow-y-auto rounded-t-[20px] border-t border-white/10 bg-surface-2/90 backdrop-blur-2xl"
      >
        <div aria-hidden className="sticky top-0 mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h3 className="text-3xl tracking-tighter">{project.title}</h3>
          <p className="mt-2 text-ink-dim">{project.tagline}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.metrics.map(m => (
              <div key={m.label} className="rounded-[20px] border border-white/10 p-4">
                <div className="text-sm text-ink-dim">{m.label}</div>
                <div className="font-mono text-xl">{m.value}</div>
              </div>
            ))}
          </div>
          {project.body.map(par => <p key={par.slice(0, 24)} className="mt-5 leading-relaxed text-ink-dim">{par}</p>)}
          <div className="mt-8 grid gap-4">
            {project.media.map(m => (
              <Image key={m.src} src={m.src} alt={m.alt} width={1200} height={800}
                className="w-full rounded-[20px] border border-white/10" unoptimized={m.kind === "gif"} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

Notes: Motion's `drag` gives 1:1 tracking + grab-offset + interruption for free (grab mid-flight works because drag reads presentation value). `dragElastic.top = 0.15` is the rubber-band above origin. Velocity handoff goes through `animate(..., { velocity })`.

- [ ] **Step 2: Mount in Work.tsx**

Replace the placeholder comment:

```tsx
{openSlug && (
  <ProjectSheet
    project={projects.find(p => p.slug === openSlug)!}
    onClose={() => setOpenSlug(null)}
  />
)}
```

Wrap in Motion's `<AnimatePresence>` so exit anims play.

- [ ] **Step 3: Build + physics check**

Serve and test in Chrome: open sheet, drag down slowly (1:1), drag up (stiff rubber-band), slow drag down past 160px then release (dismisses), fast flick down from near top (dismisses via projection), flick then catch mid-flight (follows finger, no jump), Escape closes, scrim click closes, body scroll locked, reduced-motion = crossfade only.

- [ ] **Step 4: Commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: drag-dismiss project sheet with momentum projection"
```

---

### Task 8: Media bridge (ScrollExpand + generative canvas)

**Files:**
- Create: `src/components/media/NeuralFlow.tsx`, `src/components/sections/MediaBridge.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `NeuralFlow({ paused }: { paused?: boolean })` client canvas component (fills parent, azure particles/edges on transparent); `<MediaBridge />`.

- [ ] **Step 1: NeuralFlow.tsx**

Canvas 2D, ~70 drifting nodes, edges drawn between nodes closer than 120px with alpha proportional to proximity, node/edge color `#38bdf8` at low alpha (nodes 0.8, edges <= 0.25), background transparent, `requestAnimationFrame` loop with cleanup, DPR-scaled, sized via `ResizeObserver` on parent. `paused` (or `useReducedMotion()`) renders one static frame and stops the loop. No pointer interaction, no React state in the loop.

- [ ] **Step 2: MediaBridge.tsx**

`ScrollExpand` wrapping a 16:9 container holding `NeuralFlow` (rounded 20 while small, radius animates to 0 at full bleed if the component supports it; otherwise keep 20). No caption, no overlay pills. Reduced motion: render the container full-width statically.

- [ ] **Step 3: Build + check + commit**

Verify expansion is scroll-scrubbed and reversible, 60fps in devtools performance panel (no long tasks from the canvas), reduced-motion static.

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: scroll-expanding neural flow media bridge"
```

---

### Task 9: Experience + Tech marquee + Capabilities

**Files:**
- Create: `src/components/sections/Experience.tsx`, `src/components/sections/TechMarquee.tsx`, `src/components/sections/Capabilities.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `roles`, `skills`, `capabilities` from content; `ScrollStack`, `ScrollVelocity`, `SpotlightCard` from bits.

- [ ] **Step 1: Experience.tsx**

`id="experience"`. `ScrollStack` with one card per `roles` entry (data-driven: `roles.map`). Card: org (large), title + period + location (mono, dim), points as plain paragraphs (no bullet dots). Cards use `--color-surface-2`, radius 20, border `white/10`. Sticky-stack behavior comes from the vendored component; verify `start: top top` pinning equivalent; if the vendored ScrollStack lacks proper pinning, replace internals with the sticky-stack skeleton from the taste skill (Section 5.A) adapted to Motion or plain CSS `position: sticky` + scale transforms.

- [ ] **Step 2: TechMarquee.tsx**

`ScrollVelocity` with `skills` joined as repeated row. THE only marquee. Azure text at 20% opacity, large display size, `aria-hidden="true"` with a visually-hidden plain `<ul>` of skills for screen readers. Pauses under reduced motion.

- [ ] **Step 3: Capabilities.tsx**

Asymmetric 2x2 (`md:grid-cols-[3fr_2fr]` row 1, `md:grid-cols-[2fr_3fr]` row 2 via two sub-grids, or single grid with varied col-spans). One `SpotlightCard` per cluster (data-driven from `capabilities`), spotlight tinted azure at low alpha. Items as plain lines.

- [ ] **Step 4: Wire, build, verify, commit**

Order in page: `<Experience />`, `<TechMarquee />`, `<Capabilities />` after `<MediaBridge />`. Verify stack pins correctly (no half-pinned card), marquee reverses with scroll direction, spotlight follows pointer.

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: experience stack, tech marquee, capabilities grid"
```

---

### Task 10: Benchmarks + Education/Certifications + Contact

**Files:**
- Create: `src/components/sections/Benchmarks.tsx`, `src/components/sections/Education.tsx`, `src/components/sections/Contact.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `roles` (Handshake entry), `certifications`, `profile` from content; `DecryptedText`, `AnimatedList`, `AnimatedContent`, `ElasticMesh`, `Beams`, `GlassIcons`, `SpecularButton` from bits; Phosphor icons `GithubLogo`, `LinkedinLogo`, `EnvelopeSimple`, `FileArrowDown`.

- [ ] **Step 1: Benchmarks.tsx**

Terminal-motif editorial block (NOT a fake terminal screenshot: real styled content, mono font, no fake chrome buttons, no fake version footer). Headline via `DecryptedText`: `"Benchmarks for frontier coding agents"`. Body: 7 domain names as `AnimatedList` (systems infrastructure, model training, ML pipelines, data processing, databases, interactive simulation, plus "and more" folded into 6 real ones if list wants exact count; use the 7 domains text from the Handshake role). One stat inline: 21 tasks. Data: derive from `roles.find(r => r.org === "Handshake AI")` points, not hardcoded copy.

- [ ] **Step 2: Education.tsx**

Quiet section, `AnimatedContent` fade only. Two blocks:
1. Education: Matrusri Engineering College, B.Tech IT, 2023-2027, CGPA 8.64 (add `education` array to content.ts following the same pattern as `certifications`: `{ school, degree, period, note }[]`, update check-content.mjs count assertion, keep data-driven).
2. Certifications: `certifications.map` rows: name, issuer, date. Adding a cert later = append to array.

- [ ] **Step 3: Contact.tsx**

`id="contact"`. Split layout: left = `ElasticMesh` wrapping portrait (`/media/portrait.webp` if present at build time; else render monogram tile: rounded-[20px] surface-2 div with "AP" in display type, check via `fs.existsSync` in a small `getPortrait()` at module scope is NOT possible client-side, so: always reference `/media/portrait.webp` with `onError` swap to monogram, implemented in a small client `Portrait.tsx` inside Contact). Right: heading `"Get in touch"` exactly once as heading, `SpecularButton` mailto CTA labeled `"Get in touch"`, `GlassIcons` row: GitHub, LinkedIn, email, resume download (`profile.resumePath`, plain `<a download>`). `Beams` as section background, azure, low intensity, behind content. Pronouns line: `He/Him` next to name in small dim text.

- [ ] **Step 4: Wire, build, verify, commit**

Full page order now: Nav, Hero, Metrics, Work, MediaBridge, Experience, TechMarquee, Capabilities, Benchmarks, Education, Contact, Footer. Verify eyebrow count across all sections <= 4, exactly one marquee, CTA label "Get in touch" appears as the only contact intent.

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: benchmarks, education, contact sections"
```

---

### Task 11: Generative posters (capture pipeline)

**Files:**
- Create: `src/components/media/posters/index.html`, `scripts/capture-posters.mjs`
- Output: `public/media/{emotion,dentalbot,gesture,chatapp,greenbasket}.webp`

**Interfaces:**
- Produces: five 1200x900 webp posters, azure-on-zinc, one per compact project without real assets.

- [ ] **Step 1: posters/index.html**

Single self-contained HTML file, five `<section class="poster" id="<slug>">` blocks each exactly 1200x900, `background: #09090b`, all art in canvas/SVG/CSS using only `#38bdf8` alpha layers + `#131316` + `#fafafa`:
- `emotion`: 7 abstract face-landmark point clusters in a row, one highlighted, soft radial azure glow behind the highlighted one.
- `dentalbot`: symmetric voice waveform (SVG path, mirrored), thin azure strokes, amplitude envelope.
- `gesture`: hand-landmark constellation (21 points of the MediaPipe hand topology connected by thin lines).
- `chatapp`: two columns of rounded message rectangles with scrambled mono glyph strings, a lock glyph made of geometric strokes between them.
- `greenbasket`: 4x3 grid of simple geometric produce silhouettes (circle, leaf arc, triangle root shapes), one azure-filled, rest outlined.
No text words on posters (glyph noise allowed), no gradients beyond radial glows, radius 20 on any card shapes.

- [ ] **Step 2: capture-posters.mjs**

```js
import { chromium } from "playwright";   // npm i -D playwright && npx playwright install chromium
import { fileURLToPath } from "url";
import path from "path";
const dir = path.dirname(fileURLToPath(import.meta.url));
const page = await (await (await chromium.launch()).newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 })).newPage();
await page.goto("file://" + path.join(dir, "../src/components/media/posters/index.html"));
for (const slug of ["emotion", "dentalbot", "gesture", "chatapp", "greenbasket"]) {
  const el = page.locator(`#${slug}`);
  await el.screenshot({ path: path.join(dir, `../public/media/${slug}.webp`), type: "jpeg", quality: 90 }).catch(async () => {
    await el.screenshot({ path: path.join(dir, `../public/media/${slug}.png`) });
  });
}
process.exit(0);
```

(Playwright screenshots support png/jpeg; if webp unsupported, capture png then convert: `npx sharp-cli -i public/media/{slug}.png -o public/media/{slug}.webp` or `cwebp`. Adjust content.ts extensions to whatever format actually ships, and update check-content paths if changed.)

- [ ] **Step 3: Run capture, eyeball all five, iterate once on any weak poster**

Run: `node scripts/capture-posters.mjs` then open the files. Posters must look deliberate: aligned to a grid, consistent stroke widths, generous negative space.

- [ ] **Step 4: Write assets/BRIEF.md (photorealistic upgrade path)**

Create `portfolio-app/assets/BRIEF.md`: for each poster slot plus the media bridge and portrait, one row with target filename, dimensions, and a ready-to-paste generation prompt (style: "abstract, azure #38BDF8 on near-black, cinematic, no text"). Ends with: drop replacements into `public/media/` with the same filenames; the site picks them up unchanged.

- [ ] **Step 5: Build + verify cards show posters + commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "feat: code-generated project posters"
```

---

### Task 12: QA gate (mechanical checks + Lighthouse)

**Files:**
- Create: `portfolio-app/scripts/check-output.mjs`
- Modify: `portfolio-app/package.json` (scripts)

- [ ] **Step 1: check-output.mjs**

```js
import { readFileSync } from "fs";
const html = readFileSync("out/index.html", "utf8");
const assert = (c, m) => { if (!c) { console.error("FAIL:", m); process.exit(1); } };
const { projects, certifications } = await import("../src/data/content.js");
for (const p of projects) assert(html.includes(p.title), `project missing: ${p.title}`);
for (const c of certifications) assert(html.includes(c.name), `cert missing: ${c.name}`);
assert(!/[—–]/.test(html.replace(/<script[\s\S]*?<\/script>/g, "")), "em/en-dash in rendered page");
assert(!/h-screen/.test(html), "h-screen used");
const eyebrows = (html.match(/uppercase[^"]*tracking-\[/g) || []).length;
assert(eyebrows <= 4, `too many eyebrows: ${eyebrows}`);
console.log("output OK");
```

Add to package.json scripts: `"check": "tsx scripts/check-content.mjs && node scripts/check-output.mjs"`, and make `build` run checks after: `"postbuild": "npm run check"` (check-output needs out/, so postbuild ordering works; check-content import path may need tsx, keep both invoked via the `check` script).

- [ ] **Step 2: Run full gate**

Run: `npm run build`
Expected: build + `content OK` + `output OK`.

- [ ] **Step 3: Lighthouse**

Serve `out/` and run: `npx lighthouse http://localhost:4173 --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=../lighthouse.json` then read scores. Targets: Performance >= 85 (WebGL backgrounds cost something; below 85 = lazy-load `Silk`/`Beams` with `next/dynamic` `{ ssr: false }` and retest), Accessibility >= 95, CLS < 0.1.

- [ ] **Step 4: Manual sweep (checklist)**

- 375px width: single column everywhere, nav collapses to StaggeredMenu, sheet drag works on touch emulation.
- `prefers-reduced-motion`: no drag on sheet (fade), marquee still, canvas static, CountUp final values.
- Keyboard: tab reaches every cell and CTA, Escape closes sheet, focus visible.
- Both spec locks by eye: no purple anywhere, no light section, radius consistent.

- [ ] **Step 5: Final commit**

```bash
cd "/Users/akhil/Akhil's Files/Portfolio" && git add -A && git commit -m "chore: QA gate with mechanical taste checks"
```

---

## Extensibility contract (verify at the end)

Adding an 8th project: append one object to `projects` in `content.ts` (+ optionally one poster section in posters/index.html + rerun capture). Bento auto-flows, sheet works, checks pass after bumping the count assertion (or relax `=== 7` to `>= 7` in check-content.mjs during Task 12 review; do relax it, exact counts were scaffolding).
Adding a certification: append to `certifications`. Education section maps it automatically.
Adding a role: append to `roles`; ScrollStack maps it.

# Akhil Prasad Portfolio - Design Spec

Date: 2026-09-01
Status: awaiting user approval

## Design read

Personal portfolio for Akhil Prasad Chinthala (AI/ML engineer, final-year B.Tech IT) aimed at hiring managers and recruiters, with an Awwwards-experimental kinetic language crossing Apple-fluid physics with React Bits components, leaning Next.js + Tailwind v4 + Motion.

Dials: `DESIGN_VARIANCE 9 / MOTION_INTENSITY 9 / VISUAL_DENSITY 3`.

This is a personal showcase, not a business product. The explicit goal is demonstrating breadth of frontend and AI skill through many distinct, well-executed effects. The taste skill (design-taste-frontend) is followed strictly; the resolution between "many effects" and "no slop" is: **more distinct sections, each a different layout family with one motivated effect - never stacked effects on one section.**

## Locked decisions

| Decision | Value |
|---|---|
| Stack | Next.js 15 (App Router, RSC), Tailwind v4, `motion/react`, React Bits `TS-TW` variants |
| Fonts | Geist + Geist Mono via `next/font` |
| Icons | `@phosphor-icons/react`, strokeWidth 1.5, one family only |
| Theme | Dark-locked, every section. `zinc-950` base, no pure #000 |
| Accent | Electric azure `#38BDF8`, one accent everywhere (Color Consistency Lock). Every React Bits component retinted to it - none ship their default purple |
| Radius scale | Cards 20px, pills full, inputs 10px (Shape Consistency Lock) |
| Email | prasadakhil0909@gmail.com |
| GitHub | github.com/Akhil-Prasad09 |
| LinkedIn | linkedin.com/in/akhil-prasad-972043289 |
| Project detail | Drag-dismiss sheet overlay (no per-project routes) |
| Projects | All seven, tiered: 2 featured + 5 compact |

## Project lineup

Featured (large bento cells, real assets):
1. **knee-mri-detect** - EfficientNet-B3 + Grad-CAM + FastAPI + React + Docker on MRNet. Assets: Grad-CAM PNGs from `Major Project/knee-mri-detect/storage/`.
2. **EV APM Agent** - EV charging fault detection, real data from 39 stations / 5+ vendors. Assets: `architecture_v2.svg`, FPR/coverage charts, `hook_selfrecovery.gif` from `ET Hackathon/ev-apm-agent/docs/`.

Compact (smaller cells):
3. **CAG Emotion Tracker** - InceptionV3 on FER-2013, 90%+ accuracy, sub-50ms latency.
4. **DentalBot booking platform** - React/Vite + Express, live client, voice AI assistant. (AI mood still)
5. **Hand-Gesture Media Controller** - MediaPipe, 30 FPS, sub-20ms. (AI mood still)
6. **Green Basket** - vanilla JS storefront. (AI mood still)

## Section map

13 sections, each a distinct layout family. ~24 React Bits components total.

| # | Section | Layout family | React Bits | Motion motivation |
|---|---|---|---|---|
| 1 | Nav | Translucent pill bar, <=72px, one line | `PillNav`, `StaggeredMenu` (mobile) | Wayfinding |
| 2 | Hero | Asymmetric split | `Silk` (bg, azure-tinted, low intensity), `SplitText` (headline), `TextType` (role line), `SpecularButton` (primary CTA) | Entrance hierarchy |
| 3 | Metrics strip | Horizontal stat row, mono numerals | `CountUp` | Real numbers: 8.64 CGPA, 90%+ FER-2013, <50ms, 21 tasks, 39 stations |
| 4 | Selected work | Bento, exactly 7 cells (2 featured + 5 compact) | `MagicBento` structure, `BorderGlow` on cells (glowIntensity ~0.4, azure), `HalftoneReveal` on featured images, `TiltedCard` on compact cells | Pointer-aware edge lighting = Apple's "light catching the material"; reveal on scroll-into-view |
| 5 | Project sheet | Overlay (not a section) | `GlassSurface` + hand-rolled Motion springs | Direct manipulation: shared-element expand, 1:1 drag, rubber-band, velocity projection, flick-to-dismiss. Spring: damping 0.8, response 0.3 |
| 6 | Media bridge | Full-bleed scroll expansion | `ScrollExpand` | Transition from Work to Experience; AI video/still slot |
| 7 | Experience | Sticky scroll stack (3 cards: AMIK, Handshake, Oasis) | `ScrollStack` | Sequence matches chronology |
| 8 | Tech marquee | Kinetic strip - THE one marquee on the page | `ScrollVelocity` | Breadth without individual attention |
| 9 | Capabilities | 2x2 asymmetric grid (LLM/GenAI, ML/CV, Backend/Serving, Web/Data) | `SpotlightCard` | Hover feedback |
| 10 | Benchmark authoring | Terminal-motif editorial block | `DecryptedText`, `AnimatedList` | Thematically motivated: the work IS terminal benchmarks |
| 11 | Education | Quiet vertical stack | `AnimatedContent` only | Deliberate rest note - not everything animates |
| 12 | Contact | Split: portrait + actions | `ElasticMesh` (portrait), `Beams` (bg), `GlassIcons` (social row), `SpecularButton` (mailto CTA - same label as hero CTA, one intent) | Materials + playful direct manipulation |
| 13 | Footer | Single line | `ShinyText` wordmark | Minimal close |

Global layers:
- `GradualBlur` scroll-edge under the nav (Apple scroll edge effect, replaces hard divider).
- `Noise` grain on `fixed inset-0 pointer-events-none z-[60]` (taste skill 6.E compliant).
- Z-index scale documented in one constants file.

## Excluded (hard bans, no override)

- All 10 cursor components: BlobCursor, GhostCursor, GlowCursor, SwarmCursor, TargetCursor, SplashCursor, Crosshair, CursorGrid, TextCursor, ImageTrail (taste skill 9.A).
- Second marquee. Light-mode sections. Multi-color glow. Em-dashes anywhere in visible copy. Scroll cues. Section-number eyebrows. Decorative status dots.
- Eyebrow cap: 13 sections means max 4 uppercase-tracking micro-labels on the whole page.

## Media slots (Claude-designed, code-generated)

No raster image-gen tool exists in this environment. Instead, Claude designs each asset as a generative code composition (canvas/shader/SVG, azure-on-zinc per the color lock), shipped live where motion helps or captured to `.webp` via headless Chrome for static slots. An optional `assets/BRIEF.md` documents prompts for a future photorealistic upgrade; nothing blocks on external generation.

| Slot | Delivery | Spec |
|---|---|---|
| Media bridge | Live animated canvas inside `ScrollExpand` | 16:9, abstract neural/data-flow motif, azure on near-black; static frame under reduced motion |
| Portrait | `public/media/portrait.webp` - USER SUPPLIES a photo (ElasticMesh wants a face; generative art defeats the point). Fallback: monogram tile | 1:1 |
| DentalBot still | Code-generated poster captured to `public/media/dentalbot.webp` | 4:3, voice-wave motif |
| Gesture still | Code-generated poster captured to `public/media/gesture.webp` | 4:3, hand-landmark constellation motif |
| Chat app still | Code-generated poster captured to `public/media/chatapp.webp` | 4:3, encrypted-stream motif |
| Green Basket still | Code-generated poster captured to `public/media/greenbasket.webp` | 4:3, grid-of-goods motif |

## LinkedIn additions (2026-09-01 pull)

- Pronouns: He/Him.
- Certifications section (new, in Education or its own quiet row): IBM Artificial Intelligence Fundamentals (Oct 2024), Deloitte Australia Data Analytics via Forage (Oct 2025).
- Experience gains SkillCraft Technology (ML Intern, ~1 month, late 2025) as a compact fourth entry in the ScrollStack.
- Project lineup becomes seven: Encrypted Chat Application (PyQt5, sockets, SQLite, AES E2E, multithreaded server) added as a compact cell. Bento becomes 2 featured + 5 compact = 7 cells exactly (cell count rule: N items, N cells).

## Data flow

All content lives in one typed file: `src/data/content.ts` (projects, roles, metrics, skills, links). Sections are RSC where possible; every animated piece is an isolated `'use client'` leaf. No global state; sheet open/close is local state in the work section; continuous values (drag, pointer) use `useMotionValue`, never `useState`.

## Error/empty/loading handling

- Static-export-friendly: no API, no forms (mailto CTA), so no server error states.
- Images: every `next/image` has explicit dimensions (CLS < 0.1); missing AI-slot files fall back to on-disk real assets or a styled placeholder tile, never a broken image.
- Reduced motion: every component above intensity 3 collapses via `useReducedMotion` / media query - sheet becomes a fade, marquee stops, backgrounds go static, CountUp renders final values.

## Performance budget

Heavy backgrounds (`Silk`, `Beams`) lazy-loaded, hero one gets `priority`. Target LCP < 2.5s, INP < 200ms, CLS < 0.1. WebGL components isolated; Motion and GSAP never mixed in one tree (React Bits TS-TW is CSS/Motion-based; no GSAP unless a chosen component vendors it).

## Testing

- `npm run build` passes (static export).
- One Playwright-free smoke: `next build` + a script asserting all seven projects render in the HTML output and zero em-dash characters appear in rendered copy (mechanical taste-skill check).
- Lighthouse run before declaring done.
- Manual: both `prefers-reduced-motion` states, mobile 375px, keyboard nav through sheet open/close.

## Out of scope (YAGNI)

Blog, CMS, per-project routes, contact form/backend, analytics, i18n, light mode.

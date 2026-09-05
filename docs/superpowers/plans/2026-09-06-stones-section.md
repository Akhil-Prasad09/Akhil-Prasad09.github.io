# Six Stones Work Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `Work` bento grid with a pinned, scroll-scrubbed section where a photoreal Infinity Gauntlet rotates upward and one stone lifts out per project, backed by a dimmed Veo clip per stone.

**Architecture:** A sticky track of `7 * 120vh` drives one `useScroll` progress value (the same pattern as `Journey.tsx`). `Stones.tsx` owns the track and hands `progress` to three children: `StoneVideo` (six crossfading video layers), `Gauntlet` (one R3F canvas inside `WebGLBoundary defer` that writes transforms in `useFrame`), and the DOM text, rail and intro headline (motion `useTransform`). Reduced motion or a dead GL context renders the existing `Work` grid instead.

**Tech Stack:** Next.js 16 static export, React 19, `motion/react` v13 (`useScroll`, `useTransform`, `useMotionValueEvent`), `@react-three/fiber` 9.7, `@react-three/drei` 10.7 (`useGLTF`, `Environment`), `three` 0.185, Tailwind v4. No new dependencies.

Spec: `docs/superpowers/specs/2026-09-06-stones-section-design.md`. Read it once before starting.

## Global Constraints

- Working directory for every command: `portfolio-app/` (the Next app). Node `>=22.18`; the check scripts import `.ts` natively.
- No new npm dependencies.
- Zero em-dashes or en-dashes (`—`, `–`) in any string that reaches the page. `check-content.mjs` and `check-output.mjs` fail the build on one.
- No `h-screen` on an in-flow element. Use `h-[100dvh]` (Journey does).
- No purple in emitted CSS. `check-output.mjs` scans every CSS file and `<style>` block for hex or oklch in the purple band. Stone colours (including Power's `#A234FF`) MUST reach the page only through inline `style={{ ... }}` from `data/stones.ts`, never through a Tailwind class or a CSS rule.
- No eyebrow (a string literal containing both `uppercase` and `tracking-`) in `src/components/sections/*.tsx` or `src/app/*.tsx`. `Stones.tsx` is the one approved exception and Task 4 exempts it in `check-output.mjs`; every other file stays clean.
- Only one WebGL context for this section, mounted through `WebGLBoundary defer`.
- Design tokens: `bg-surface` (#09090b), `bg-surface-2` (#131316), `text-ink` (#fafafa), `text-ink-dim` (#a1a1aa), `text-accent` (#38bdf8), `rounded-card` (20px). Fonts: `font-sans` Geist, `font-mono` Geist Mono.
- Type-check with `npx tsc --noEmit -p .` after every code step. Full gate is `npm run build` (runs `next build` then `npm run check`, which runs `scripts/check-content.mjs` and `scripts/check-output.mjs`).
- Commit after every task. No attribution lines in commit messages.

## File Structure

| File | Responsibility |
|---|---|
| `src/data/stones.ts` (create) | The six stone rows (`id`, `name`, `hex`, `mesh`, `slug`), `STOPS`, and the Veo prompts. Pure data, no React. |
| `src/components/sections/StoneVideo.tsx` (create) | Six absolutely positioned layers, each a radial gradient plus a `<video>`; opacity from `progress`, play/pause from the active index, no video below `md`. |
| `src/components/sections/Gauntlet.tsx` (create) | The R3F canvas. Loads the GLB, assigns materials once, and in `useFrame` writes gauntlet pose, stone lift, scale, emissive and rim-light colour from `progress`. All tunable numbers are constants at the top. |
| `src/components/sections/Stones.tsx` (create) | Owner: pinned track, `useScroll`, intro headline, six `StoneCard`s, `StoneRail`, `ProjectSheet` state, fallbacks to `Work`. |
| `src/components/bits/WebGLBoundary.tsx` (modify) | Add an `onFail` callback so the owner can swap the whole section to `Work` when the GL context dies. |
| `src/components/sections/Footer.tsx` (modify) | CC-BY credit line for the model. |
| `src/app/page.tsx` (modify) | `<Work />` becomes `<Stones />`. |
| `scripts/check-content.mjs` (modify) | Stones rows resolve to projects and to GLB meshes whose material carries the stone name. |
| `scripts/check-output.mjs` (modify) | Title check covers the six shown projects; eyebrow exemption for `Stones.tsx`; credit and headline present. |

Assets already in place (do not regenerate): `public/models/gauntlet.glb`, `public/models/LICENSE-gauntlet.txt`, `public/media/stones/{mind,soul,reality,space,power,time}.{mp4,jpg}`.

Existing pieces to reuse, not rewrite: `Work` (`src/components/sections/Work.tsx`) as the fallback, `ProjectSheet` (`src/components/sections/ProjectSheet.tsx`, props `{ project: Project; onClose: () => void }`, must be wrapped in `AnimatePresence`), `projects` and `Project` from `src/data/content.ts` (`Project` has `slug`, `title`, `tagline`, `tags: string[]`).

---

### Task 1: Stone data and the content check

**Files:**
- Create: `src/data/stones.ts`
- Modify: `scripts/check-content.mjs`

**Interfaces:**
- Produces: `stones: Stone[]` (six rows in canonical order Mind, Soul, Reality, Space, Power, Time), `type Stone = { id: StoneId; name: string; hex: string; mesh: string; slug: string }`, `type StoneId = "mind" | "soul" | "reality" | "space" | "power" | "time"`, `STOPS = 7` (one intro stop plus six stone stops), `veoPrompts: Record<StoneId, string>`. Later tasks index stone `i` as stop `i + 1`, so stone `i` owns progress `[(i + 1) / STOPS, (i + 2) / STOPS]`.

- [ ] **Step 1: Write the failing check**

Edit `scripts/check-content.mjs`. Replace the first line's import block and add the stones block after the `stats` assertion. The whole file becomes:

```js
import { readFileSync } from "node:fs";
import { projects, certifications, education, roles, stats, capabilities } from "../src/data/content.ts";
import { stones, STOPS } from "../src/data/stones.ts";
// Run by `npm run check`; assertions below are the acceptance contract. Counts
// are floors, not fixtures: appending to content.ts must never fail the gate.
const assert = (c, msg) => { if (!c) { console.error("FAIL:", msg); process.exit(1); } };
assert(projects.length >= 7, "at least 7 projects");
assert(projects.filter(p => p.tier === "featured").length === 2, "2 featured");
assert(new Set(projects.map(p => p.slug)).size === projects.length, "unique slugs");
assert(roles.length >= 3, "at least 3 roles");
assert(certifications.length >= 2, "at least 2 certifications");
assert(education.length >= 1, "at least 1 education entry");
assert(capabilities.length === 4, "4 capability clusters");
assert(stats.length >= 4, "at least 4 stats");
for (const p of projects) {
  assert(p.media.length >= 1, `${p.slug}: needs at least one media item`);
  assert(p.body.length <= 3 && p.body.length >= 1, `${p.slug}: 1-3 body paragraphs`);
}

// Six stones, six stops plus the intro. Each stone names a real project and a
// real mesh in the gauntlet GLB, and that mesh's material is named after the
// stone (the modeler's naming is the source of truth for which socket is which).
// The GLB is read as raw bytes: a .glb is a 12-byte header, then a JSON chunk
// (4-byte length, 4-byte type, payload). No three.js needed at check time.
assert(stones.length === 6, "6 stones");
assert(STOPS === stones.length + 1, "STOPS is stones + intro");
assert(new Set(stones.map(s => s.mesh)).size === stones.length, "unique stone meshes");
const glb = readFileSync("public/models/gauntlet.glb");
const gltf = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString("utf8"));
const materialOf = new Map(
  gltf.nodes
    .filter(n => n.mesh !== undefined)
    .map(n => [n.name, gltf.materials[gltf.meshes[n.mesh].primitives[0].material].name]),
);
for (const s of stones) {
  assert(projects.some(p => p.slug === s.slug), `stone ${s.id}: no project with slug ${s.slug}`);
  assert(materialOf.has(s.mesh), `stone ${s.id}: no mesh ${s.mesh} in gauntlet.glb`);
  assert(materialOf.get(s.mesh).startsWith(s.id), `stone ${s.id}: mesh ${s.mesh} has material ${materialOf.get(s.mesh)}`);
  assert(/^#[0-9A-Fa-f]{6}$/.test(s.hex), `stone ${s.id}: hex ${s.hex}`);
}

const banned = /[—–]/;
const scan = (o, path) => {
  if (typeof o === "string") assert(!banned.test(o), `em/en-dash in ${path}: ${o}`);
  else if (Array.isArray(o)) o.forEach((v, i) => scan(v, `${path}[${i}]`));
  else if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => scan(v, `${path}.${k}`));
};
scan({ projects, certifications, education, roles, stats, capabilities, stones }, "content");
console.log("content OK");
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-content.mjs`
Expected: fails with `Cannot find module '.../src/data/stones.ts'`.

- [ ] **Step 3: Create the data file**

Create `src/data/stones.ts`:

```ts
/**
 * The six stones of the Work section, in the reference's canonical order.
 * `mesh` is the node name in public/models/gauntlet.glb whose material is
 * named after the stone; scripts/check-content.mjs asserts that pairing.
 * Colours reach the page only through inline styles (see check-output.mjs's
 * purple lock), so they live here and nowhere in CSS.
 */
export type StoneId = "mind" | "soul" | "reality" | "space" | "power" | "time";

export interface Stone {
  id: StoneId;
  name: string; // display name; rendered as "<name> Stone"
  hex: string;
  mesh: string;
  slug: string; // projects[].slug in content.ts
}

export const stones: Stone[] = [
  { id: "mind", name: "Mind", hex: "#FFD700", mesh: "Object_7", slug: "cag-emotion-tracker" },
  { id: "soul", name: "Soul", hex: "#FF7A1A", mesh: "Object_10", slug: "dentalbot" },
  { id: "reality", name: "Reality", hex: "#FF2D2D", mesh: "Object_9", slug: "knee-mri-detect" },
  { id: "space", name: "Space", hex: "#2D7CFF", mesh: "Object_11", slug: "gesture-controller" },
  { id: "power", name: "Power", hex: "#A234FF", mesh: "Object_8", slug: "ev-apm-agent" },
  { id: "time", name: "Time", hex: "#22E07A", mesh: "Object_12", slug: "encrypted-chat" },
];

/** Scroll stops: one intro stop, then one per stone. Stone i owns stop i + 1. */
export const STOPS = stones.length + 1;

/** Prompts used in Google Flow (Veo 3.1 Fast, 8 s, 16:9) for public/media/stones/<id>.mp4. */
export const veoPrompts: Record<StoneId, string> = {
  mind: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, golden yellow, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with slow pulsing luminous energy like neural activity, fine golden dust motes drifting, floating in black void, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
  soul: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, deep orange, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with slow breathing amber light, faint mist curling around it, floating in black void, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
  reality: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, crimson red, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with liquid red energy that warps the air around it like heat haze, fine red particles, floating in black void, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
  space: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, sapphire blue, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with slow swirling luminous blue energy like a captured cosmic force, thin blue lightning threads flickering inside it, floating in black void, star-like dust, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
  power: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, violet purple, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with dense purple energy arcs crackling outward and fading, heavy glow, small floating debris, floating in black void, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
  time: "Generate one 8 second video, 16:9: Photorealistic close-up of a smooth glassy oval cabochon stone, emerald green, perfectly smooth rounded dome surface like a polished river pebble, absolutely no facets or cut edges, glowing from within with slow rotating rings of green light orbiting it, fine green dust, floating in black void, shallow depth of field, no camera movement, seamless loop, cinematic lighting.",
};
```

- [ ] **Step 4: Run the check to verify it passes**

Run: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-content.mjs && npx tsc --noEmit -p .`
Expected: `content OK`, then tsc exits 0 with no output.

- [ ] **Step 5: Commit**

```bash
git add src/data/stones.ts scripts/check-content.mjs
git commit -m "feat(stones): stone data and GLB mesh check"
```

---

### Task 2: StoneVideo layers

**Files:**
- Create: `src/components/sections/StoneVideo.tsx`

**Interfaces:**
- Consumes: `stones`, `STOPS` from `@/data/stones`.
- Produces: `export function StoneVideo({ progress }: { progress: MotionValue<number> })`. Renders an `absolute inset-0 pointer-events-none` container; the parent must be `relative` or `sticky` with a real height.

- [ ] **Step 1: Write the component**

Create `src/components/sections/StoneVideo.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { stones, STOPS, type Stone } from "@/data/stones";

/**
 * One dimmed backdrop per stone, crossfading with scroll. Every layer always
 * carries a radial gradient in the stone colour; the <video> sits on top of it
 * and only exists at `md` and up, so phones get the gradient (and no decode
 * cost). A clip that fails to load falls back to the gradient via onError. Only
 * the active clip and its successor play; the rest are paused.
 */
export function StoneVideo({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(-1);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Stone i owns stop i + 1, so the intro (stop 0) maps to -1: nothing active.
  useMotionValueEvent(progress, "change", (p) => {
    const i = Math.min(stones.length - 1, Math.floor(p * STOPS) - 1);
    setActive((a) => (a === i ? a : i));
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stones.map((stone, i) => (
        <Layer
          key={stone.id}
          stone={stone}
          index={i}
          progress={progress}
          showVideo={wide}
          playing={wide && (i === active || i === active + 1)}
        />
      ))}
    </div>
  );
}

function Layer({
  stone,
  index,
  progress,
  showVideo,
  playing,
}: {
  stone: Stone;
  index: number;
  progress: MotionValue<number>;
  showVideo: boolean;
  playing: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);

  // Fade in over the last 40% of the previous stop, hold through this stop,
  // fade out over the first 40% of the next one.
  const start = (index + 1) / STOPS;
  const end = (index + 2) / STOPS;
  const fade = 0.4 / STOPS;
  const opacity = useTransform(progress, [start - fade, start, end, end + fade], [0, 1, 1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 62% 50%, ${stone.hex}40 0%, transparent 62%)` }}
      />
      {showVideo && !broken && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={`/media/stones/${stone.id}.jpg`}
          src={`/media/stones/${stone.id}.mp4`}
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/StoneVideo.tsx
git commit -m "feat(stones): crossfading Veo backdrop layers"
```

---

### Task 3: Gauntlet canvas

**Files:**
- Create: `src/components/sections/Gauntlet.tsx`

**Interfaces:**
- Consumes: `stones`, `STOPS` from `@/data/stones`; `/models/gauntlet.glb`.
- Produces: `export function Gauntlet({ progress }: { progress: MotionValue<number> })`. Renders a `<Canvas>` filling its parent (`h-full w-full`), so the parent must size it. Suspends while the GLB loads; the parent wraps it in `WebGLBoundary`.

Frame math the spec fixes and this file implements: stop width is `1 / STOPS`; stone `i` starts at `(i + 1) / STOPS`; local `t` in `[0, 1]`; lift curve rises over `t` 0 to 0.25, holds to 0.75, returns to 1; scale `1 -> 3`; emissive `0.2 -> 2.5`, resting at `0.8` once claimed. Gauntlet `rotation.x` goes `-0.9 -> 0` over the first half of the section, `rotation.y` sweeps `+0.6` over the whole section, and both carry a `±0.03` idle tumble.

Coordinate note for whoever tunes this: the GLB is Z-up and its root node is rotated -90 degrees about X. Stone meshes are children of that root, so anything written to a stone's `position` is in the local Z-up frame: local `-y` points at the camera, local `-x` is the text (left) side, local `+z` is world up. `LIFT` below is expressed in that frame. The wrapper `<group>` is in world space, so its rotation and position are the intuitive ones.

- [ ] **Step 1: Write the component**

Create `src/components/sections/Gauntlet.tsx`:

```tsx
"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Color, Group, Mesh, MeshStandardMaterial, SpotLight, Vector3 } from "three";
import type { MotionValue } from "motion/react";
import { stones, STOPS } from "@/data/stones";

const MODEL = "/models/gauntlet.glb";

// Pose constants. Tuned by eye in the browser; keep them all here.
const GROUP_POS = new Vector3(0.7, -0.15, 0); // fist sits centre-right of the viewport
const ENTER_FROM_Y = -2.6; // intro: gauntlet rises from below
const ROT_X_START = -0.9; // knuckles tilted toward the viewer, fist low
const ROT_Y_SWEEP = 0.6; // slow turn across the whole section
const TUMBLE = 0.03; // idle wobble amplitude, radians
// Stone offset at full lift, in the GLB's local Z-up frame (see file comment).
const LIFT = new Vector3(-0.35, -0.6, 0.12);
const LIFT_SCALE = 3;
const BOB = 0.02;
const EMISSIVE_DIM = 0.2;
const EMISSIVE_CLAIMED = 0.8;
const EMISSIVE_LIFT = 2.5;
const RIM_IDLE = new Color("#ffffff");

const GOLD = new MeshStandardMaterial({ color: "#c9a24a", metalness: 1, roughness: 0.35 });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
/** Lift for local stop progress t: rise 0 to 0.25, hold to 0.75, return to 1. */
const liftOf = (t: number) => (t < 0.25 ? smooth(t / 0.25) : t < 0.75 ? 1 : smooth((1 - t) / 0.25));

export function Gauntlet({ progress }: { progress: MotionValue<number> }) {
  // dpr 1 below md, up to 1.5 on desktop. Safe to read window here: WebGLBoundary
  // defers this component to the client, so it never renders on the server.
  const [dpr] = useState<number | [number, number]>(() =>
    window.matchMedia("(min-width: 768px)").matches ? [1, 1.5] : 1,
  );
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.1, 3.4], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Rig progress={progress} />
      </Suspense>
    </Canvas>
  );
}

type StoneRig = { mesh: Mesh; rest: Vector3; color: Color; material: MeshStandardMaterial };

function Rig({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF(MODEL);
  const group = useRef<Group>(null);
  const rim = useRef<SpotLight>(null);
  const rimColor = useMemo(() => new Color(), []);

  // useGLTF caches the scene, and WebGLBoundary remounts this canvas every time
  // the section scrolls back into view, so the one-time geometry surgery below
  // is guarded by userData or the stones would drift on every remount.
  const rigs = useMemo<StoneRig[]>(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh && !m.userData.stone) m.material = GOLD;
    });
    return stones.map((s) => {
      const mesh = scene.getObjectByName(s.mesh) as Mesh;
      if (!mesh.userData.stone) {
        const geo = mesh.geometry;
        geo.computeBoundingBox();
        const centre = geo.boundingBox!.getCenter(new Vector3());
        geo.translate(-centre.x, -centre.y, -centre.z);
        mesh.position.copy(centre);
        mesh.material = new MeshStandardMaterial({
          color: s.hex,
          emissive: s.hex,
          emissiveIntensity: EMISSIVE_DIM,
          roughness: 0.15,
          metalness: 0,
        });
        mesh.userData.stone = s.id;
      }
      return {
        mesh,
        rest: mesh.position.clone(),
        color: new Color(s.hex),
        material: mesh.material as MeshStandardMaterial,
      };
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = progress.get();
    const stop = 1 / STOPS;
    const time = clock.elapsedTime;

    // Gauntlet pose: rise in during the intro, tilt up over the first half, sweep, tumble.
    g.position.set(
      GROUP_POS.x,
      ENTER_FROM_Y + (GROUP_POS.y - ENTER_FROM_Y) * smooth(p / stop),
      GROUP_POS.z,
    );
    g.rotation.x = ROT_X_START * (1 - smooth(p / 0.5)) + Math.sin(time * 0.4) * TUMBLE;
    g.rotation.y = ROT_Y_SWEEP * p + Math.cos(time * 0.3) * TUMBLE;

    let active = -1;
    let activeLift = 0;
    rigs.forEach(({ mesh, rest, material }, i) => {
      const start = (i + 1) * stop;
      const inStop = p > start && p < start + stop;
      const lift = inStop ? liftOf((p - start) / stop) : 0;
      const claimed = p >= start + stop;

      mesh.position.copy(rest).addScaledVector(LIFT, lift);
      mesh.position.z += Math.sin(time * 2 + i) * BOB * lift; // hold bob, local z is world up
      mesh.scale.setScalar(1 + (LIFT_SCALE - 1) * lift);
      const base = claimed ? EMISSIVE_CLAIMED : EMISSIVE_DIM;
      material.emissiveIntensity = base + (EMISSIVE_LIFT - base) * lift;

      if (lift > activeLift) {
        activeLift = lift;
        active = i;
      }
    });

    if (rim.current) {
      rimColor.copy(RIM_IDLE);
      if (active >= 0) rimColor.lerp(rigs[active].color, activeLift);
      rim.current.color.copy(rimColor);
    }
  });

  return (
    <>
      <spotLight ref={rim} position={[-2.5, 2, 2.5]} intensity={60} angle={0.6} penumbra={0.8} decay={1.5} />
      <group ref={group}>
        <primitive object={scene} />
      </group>
    </>
  );
}

useGLTF.preload(MODEL);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: exits 0. If `useGLTF.preload` is flagged, it is exported on the hook object in drei 10.7 (`node_modules/@react-three/drei/core/Gltf.d.ts`); check the name before changing anything.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Gauntlet.tsx
git commit -m "feat(stones): gauntlet canvas driven by scroll progress"
```

---

### Task 4: Stones section, page swap, footer credit, output checks

**Files:**
- Modify: `src/components/bits/WebGLBoundary.tsx`
- Create: `src/components/sections/Stones.tsx`
- Modify: `src/components/sections/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `scripts/check-output.mjs`

**Interfaces:**
- Consumes: `StoneVideo({ progress })` from Task 2, `Gauntlet({ progress })` from Task 3, `stones`, `STOPS`, `Stone` from Task 1, existing `Work`, `ProjectSheet`, `projects`.
- Produces: `export function Stones()` rendering `<section id="work">` (the nav links to `#work`), and `WebGLBoundary` gains `onFail?: () => void`.

- [ ] **Step 1: Add `onFail` to WebGLBoundary**

In `src/components/bits/WebGLBoundary.tsx`, change the `Fallback` type and the `Catch` class:

```tsx
type Fallback = { children: ReactNode; fallback?: ReactNode; onFail?: () => void };

class Catch extends Component<Fallback, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
```

Then thread it through the wrapper. The signature becomes:

```tsx
export function WebGLBoundary({
  children,
  fallback = null,
  onFail,
  defer = false,
  placeholderClassName,
}: Fallback & { defer?: boolean; placeholderClassName?: string }) {
```

and the mounted branch becomes `<Catch fallback={fallback} onFail={onFail}>{children}</Catch>`. Nothing else in the file changes.

- [ ] **Step 2: Write the failing output checks**

In `scripts/check-output.mjs`:

Add after the existing content import:

```js
import { stones } from "../src/data/stones.ts";
```

Replace the project title loop

```js
for (const p of projects) assert(markup.includes(p.title), `project missing: ${p.title}`);
```

with

```js
// The Work section shows the six stone projects; Green Basket stays in
// content.ts (and the reduced-motion grid) but is not in the static markup.
const shown = new Set(stones.map((s) => s.slug));
for (const p of projects.filter((p) => shown.has(p.slug))) {
  assert(markup.includes(p.title), `project missing: ${p.title}`);
}
assert(markup.includes("Six stones. Six proofs of work."), "stones intro headline missing");
assert(markup.includes("Xorrrupted"), "gauntlet CC-BY credit missing from footer");
```

In the eyebrow block, change the `sectionSources` filter so `Stones.tsx` is exempt, with the reason recorded:

```js
// Stones.tsx is the one approved exception (spec 2026-09-06): its mono stone
// label and wide-tracked uppercase title reproduce the reference design.
const sectionSources = ["src/components/sections", "src/app"].flatMap((dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && f !== "Stones.tsx")
    .map((f) => join(dir, f)),
);
```

- [ ] **Step 3: Run the build to verify the new checks fail**

Run: `npm run build 2>&1 | tail -20`
Expected: `next build` succeeds, then `check-output.mjs` prints `FAIL: stones intro headline missing` and `FAIL: gauntlet CC-BY credit missing from footer` and exits 1.

- [ ] **Step 4: Write Stones.tsx**

Create `src/components/sections/Stones.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { projects } from "@/data/content";
import { stones, STOPS, type Stone } from "@/data/stones";
import WebGLBoundary from "@/components/bits/WebGLBoundary";
import { Gauntlet } from "./Gauntlet";
import { StoneVideo } from "./StoneVideo";
import { ProjectSheet } from "./ProjectSheet";
import { Work } from "./Work";

/**
 * Six stones, six projects. The section pins for VH_PER_STOP viewports per stop
 * (one intro stop plus one per stone). One scroll progress value owns every
 * visual: the gauntlet pose and stone lift (Gauntlet), the backdrop crossfade
 * (StoneVideo), the intro headline, the per-stone text and the rail. Reverse
 * scrolling replays everything backwards.
 *
 * Reduced motion, or a WebGL context that fails to create, renders the Work
 * grid instead; the data is identical.
 */

const VH_PER_STOP = 120;
const STOP = 1 / STOPS;

export function Stones() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [glFailed, setGlFailed] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  if (reduced || glFailed) return <Work />;

  const open = projects.find((p) => p.slug === openSlug);

  // Land 40% into the stop, where the stone is fully lifted and the text is readable.
  const scrollToStop = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const trackTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: trackTop + scrollable * ((i + 1) * STOP + STOP * 0.4), behavior: "smooth" });
  };

  return (
    <section id="work" aria-label="Selected work">
      <div ref={trackRef} className="relative" style={{ height: `${STOPS * VH_PER_STOP}vh` }}>
        <div className="sticky top-0 h-[100dvh] overflow-hidden bg-surface">
          <StoneVideo progress={scrollYProgress} />
          <div className="absolute inset-0">
            <WebGLBoundary defer onFail={() => setGlFailed(true)} placeholderClassName="h-full w-full">
              <Gauntlet progress={scrollYProgress} />
            </WebGLBoundary>
          </div>
          <Intro progress={scrollYProgress} />
          {stones.map((stone, i) => (
            <StoneCard key={stone.id} stone={stone} index={i} progress={scrollYProgress} onOpen={setOpenSlug} />
          ))}
          <StoneRail progress={scrollYProgress} onJump={scrollToStop} />
        </div>
      </div>
      <AnimatePresence>
        {open && <ProjectSheet project={open} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </section>
  );
}

function Intro({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, STOP * 0.75, STOP], [1, 1, 0]);
  const y = useTransform(progress, [0, STOP], [0, -40]);
  return (
    <motion.h2
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-4 top-[40%] text-center text-4xl tracking-tighter md:text-6xl"
    >
      Six stones. Six proofs of work.
    </motion.h2>
  );
}

/**
 * One stone's text block plus its ghost numeral. Both rise in over the first
 * quarter of the stop, hold, and fall away over the last quarter, mirroring the
 * stone's lift in Gauntlet.tsx. Visibility follows opacity so hidden cards are
 * neither clickable nor in the tab order.
 */
function StoneCard({
  stone,
  index,
  progress,
  onOpen,
}: {
  stone: Stone;
  index: number;
  progress: MotionValue<number>;
  onOpen: (slug: string) => void;
}) {
  const project = projects.find((p) => p.slug === stone.slug)!;
  const start = (index + 1) * STOP;
  const end = start + STOP;
  const rise = start + STOP * 0.25;
  const leave = start + STOP * 0.75;

  const opacity = useTransform(progress, [start, rise, leave, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, rise, leave, end], [48, 0, 0, -32]);
  const visibility = useTransform(opacity, (o) => (o > 0.02 ? "visible" : "hidden"));
  const numeral = `0${index + 1}`;

  return (
    <>
      <motion.div
        style={{ opacity, y, visibility }}
        className="absolute inset-y-0 left-4 flex w-[min(90vw,34rem)] flex-col justify-center md:left-12"
      >
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: stone.hex }}>
          <span aria-hidden="true" className="inline-block size-2" style={{ background: stone.hex }} />
          {`${numeral} / 0${stones.length} · ${stone.name} Stone`}
        </p>
        <h3 className="mt-5 text-4xl uppercase leading-[1.05] tracking-[0.18em] md:text-5xl">
          <button
            type="button"
            onClick={() => onOpen(project.slug)}
            aria-haspopup="dialog"
            className="text-left transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-dim">{project.tagline}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-ink-dim">
              {tag}
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.span
        aria-hidden="true"
        style={{ opacity }}
        className="pointer-events-none absolute -bottom-[0.12em] right-2 font-mono text-[18vw] font-bold leading-none text-white/[0.06]"
      >
        {numeral}
      </motion.span>
    </>
  );
}

/**
 * Six diamonds on a dashed vertical line at the right edge. A diamond ignites
 * as its stone starts lifting (10% into the stop) and stays lit, so the rail
 * counts claimed stones. Clicking one scrolls the track to that stop.
 */
function StoneRail({ progress, onJump }: { progress: MotionValue<number>; onJump: (i: number) => void }) {
  const [claimed, setClaimed] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const n = Math.max(0, Math.min(stones.length, Math.floor(p * STOPS - 0.1)));
    setClaimed((c) => (c === n ? c : n));
  });

  return (
    <ol aria-label="Stones" className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6 md:right-8">
      {stones.map((stone, i) => {
        const lit = i < claimed;
        return (
          <li key={stone.id} className="relative">
            {i > 0 && (
              <span aria-hidden="true" className="absolute -top-6 left-1/2 h-6 -translate-x-1/2 border-l border-dashed border-white/20" />
            )}
            <button
              type="button"
              aria-label={`Go to ${stone.name} Stone`}
              onClick={() => onJump(i)}
              className="block size-2.5 rotate-45 transition-[background-color,box-shadow] duration-300"
              style={{
                background: lit ? stone.hex : "rgba(255, 255, 255, 0.2)",
                boxShadow: lit ? `0 0 12px ${stone.hex}` : "none",
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 5: Swap the page and add the footer credit**

In `src/app/page.tsx`, replace `import { Work } from "@/components/sections/Work";` with `import { Stones } from "@/components/sections/Stones";` and replace `<Work />` with `<Stones />`.

Replace `src/components/sections/Footer.tsx` with:

```tsx
import ShinyText from "@/components/bits/ShinyText";
import { profile } from "@/data/content";

const link = "underline underline-offset-2 hover:text-ink";

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-dim">
      <ShinyText text={profile.name} speed={3} color="#a1a1aa" shineColor="#38bdf8" />
      <p className="mt-1">{profile.role}</p>
      <p className="mt-4 text-xs">
        Gauntlet model:{" "}
        <a href="https://sketchfab.com/3d-models/infinity-gauntlet-2d2ee90a237a44b68c5f7aa59a1c0fc2" className={link}>
          Infinity Gauntlet
        </a>{" "}
        by{" "}
        <a href="https://sketchfab.com/loghawk360" className={link}>
          Xorrrupted
        </a>
        ,{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/" className={link}>
          CC BY 4.0
        </a>
        .
      </p>
    </footer>
  );
}
```

- [ ] **Step 6: Run the full gate**

Run: `npx tsc --noEmit -p . && npm run build 2>&1 | tail -15`
If tsc rejects `visibility` in the `StoneCard` style object, type the transform's return as `"visible" | "hidden"` (`useTransform(opacity, (o): "visible" | "hidden" => ...)`); the value logic stays the same.
Expected: tsc exits 0; build ends with `content OK` and `output OK`. If `check-output` reports `purple in emitted CSS`, a stone hex leaked into a class or CSS rule; move it back to an inline `style`. If it reports `eyebrow in section source`, the offending literal is outside `Stones.tsx` (the exemption is by filename).

- [ ] **Step 7: Commit**

```bash
git add src/components/bits/WebGLBoundary.tsx src/components/sections/Stones.tsx src/components/sections/Footer.tsx src/app/page.tsx scripts/check-output.mjs
git commit -m "feat(stones): pinned six-stones work section replaces the grid"
```

---

### Task 5: Tune in the browser and run the manual checks

**Files:**
- Modify: `src/components/sections/Gauntlet.tsx` (constants only)
- Modify: `src/components/sections/Stones.tsx` (layout classes only, if text collides with the gauntlet)

**Interfaces:**
- Consumes: everything above. Produces nothing new; this task records the tuned constants.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000/#work` in Chrome, desktop width (1440 or wider). Open DevTools console; there must be no red errors. Two yellow drei warnings about the Environment or Draco CDN fetch are acceptable only if the model still renders.

- [ ] **Step 2: Check the intro stop**

Scroll so the section top pins. Expected: headline "Six stones. Six proofs of work." centred, gauntlet rising into view from below on the centre-right, all six stones dim, no video visible yet. If the gauntlet is off-screen or clipped, adjust `GROUP_POS` and the camera `position` in `Gauntlet.tsx` (model is about 2 units tall; camera at z 3.4 with fov 35 frames roughly 2.1 units vertically).

- [ ] **Step 3: Check each stone stop**

Scroll slowly through the six stops. At each one confirm, in order: the stone that lifts matches the label colour (yellow Mind, orange Soul, red Reality, blue Space, purple Power, green Time), the lifted stone moves toward the camera and the text side rather than into the gauntlet, the backdrop clip matches the colour, the rail has `i + 1` lit diamonds, the ghost numeral reads `0(i + 1)`. If a stone lifts in the wrong direction, change the sign of the matching `LIFT` component in `Gauntlet.tsx` (the frame note at the top of that file explains which axis is which); do not touch `stones.ts`, the mesh mapping is verified by the check script.

- [ ] **Step 4: Check the reverse and the sheet**

Scroll back to the top: every stone returns to its socket, claimed stones dim back to unlit as their stop is un-scrolled, the rail count falls, the headline returns. Then scroll to any stone, click its title: `ProjectSheet` opens; drag it down to dismiss. Click a rail diamond: the page scrolls to that stone's hold phase.

- [ ] **Step 5: Check 390px**

DevTools device toolbar, 390 x 844. Expected: no `<video>` elements in the Elements panel inside `#work`, gradients still crossfade, text is readable over the gauntlet (if the gauntlet sits under the text, raise `GROUP_POS.x` or add `md:` prefixes so the card is narrower below `md`).

- [ ] **Step 6: Check reduced motion**

DevTools Rendering panel, `prefers-reduced-motion: reduce`, reload. Expected: the old Work grid renders, no `<canvas>` inside `#work`.

- [ ] **Step 7: Commit the tuned constants**

Run `npm run build 2>&1 | tail -5` one last time (expected `content OK`, `output OK`), then:

```bash
git add src/components/sections/Gauntlet.tsx src/components/sections/Stones.tsx
git commit -m "tune(stones): gauntlet pose and lift constants from browser pass"
```

If nothing needed changing, skip the commit and note that in the task report.

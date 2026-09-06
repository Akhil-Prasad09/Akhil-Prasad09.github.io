# Six Stones Work Section - Design Spec

Date: 2026-09-06
Status: approved by user in conversation, assets in place, awaiting written review

## Summary

Replace the `Work` bento grid with a pinned, scroll-scrubbed "six stones" sequence modelled on a reference screen recording (`Gauntlet Video.mp4`). A photoreal Infinity Gauntlet rotates upward as the visitor scrolls; one stone lifts out of its socket per project, holds while the project text is read, and returns. Six projects, six stones. Experience and Contact are out of scope; the user has separate plans for them.

## Locked decisions

| Decision | Value |
|---|---|
| Scope | Projects section only. `Work` grid becomes the reduced-motion / no-WebGL fallback and is otherwise unmounted |
| Scroll engine | `motion/react` `useScroll` on a sticky pinned track, same pattern as `Journey.tsx`. No GSAP on this section |
| 3D | One R3F canvas inside the existing `WebGLBoundary` with `defer`. Never more than one GL context for this section. Desktop adds an `EffectComposer` with `Bloom` (threshold 1, so only the HDR-emissive gems glow) and ACES tone mapping; phones render plain. Lighting is an owned `Environment` of `Lightformer` panels plus a key light and the stone-coloured rim spot, no CDN HDR |
| Model | `public/models/gauntlet.glb` (324 KB, Draco + WebP, 33k tris, one baked 2K colour map). Source: "Manopla Infinito 3D Model" by gothic404 on Sketchfab, CC-BY-4.0, re-encoded with gltf-transform and with the mirrored phantom thumb cut out of the mesh. Credit line in Footer, full text in `public/models/LICENSE-gauntlet.txt`. Replaced the untextured Xorrrupted sculpt on 2026-09-06 after the user judged it too crude |
| Stones | Six procedural cabochon gems (flattened spheres, `MeshPhysicalMaterial` with clearcoat and HDR emissive) placed over the model's painted sockets, plus a dark cap under each so the socket reads empty once the gem lifts. The model is a single mesh, so its own stones cannot move |
| Background | One Veo clip per stone, dimmed, crossfading with scroll. Dark radial gradient in the stone colour until the clip exists |
| Projects | Six of the seven in `content.ts`. Green Basket stays in the data file and is not shown |
| Interaction | Clicking a stone's title opens the existing `ProjectSheet`. No new routes |
| Copy | Zero em-dashes in visible text. Stone labels use the film names |

## Stone mapping

Canonical order from the reference. Socket coordinates are in the gauntlet mesh's local frame (the root node rotates it +90 degrees about X, so local -z is up and local +y faces the camera). They were sampled from the vertices whose texture colour matches each painted stone, and the normal is the mean vertex normal within 5 cm of the socket. `check-content.mjs` asserts each socket lies inside the mesh bounds read from the POSITION accessor.

| # | Stone | Colour | Socket (x, y, z) | Radius | Project slug |
|---|---|---|---|---|---|
| 01 | Mind | `#FFD700` | -0.023, 0.276, -1.082 | 0.085 | `cag-emotion-tracker` |
| 02 | Soul | `#FF7A1A` | -0.230, 0.160, -1.344 | 0.046 | `dentalbot` |
| 03 | Reality | `#FF2D2D` | -0.122, 0.223, -1.356 | 0.048 | `knee-mri-detect` |
| 04 | Space | `#2D7CFF` | 0.060, 0.231, -1.321 | 0.048 | `gesture-controller` |
| 05 | Power | `#A234FF` | 0.179, 0.202, -1.318 | 0.046 | `ev-apm-agent` |
| 06 | Time | `#22E07A` | 0.277, -0.115, -0.904 | 0.050 | `encrypted-chat` |

The layout follows the film: Mind on the back of the hand, Soul to Power across the knuckles from the little finger, Time on the thumb.

## Scroll choreography

Track height is `7 * 120vh`: one intro stop plus six stone stops, matching Journey's per-stop budget. Progress `p` in [0, 1] owns every visual; nothing runs on a clock except the video loops and a slow idle tumble on the gauntlet. Reverse scrolling replays backwards.

Intro stop (`p` 0 to 1/7): headline "Six stones. Six proofs of work." centred, gauntlet enters from below in its start pose, all stones dim. Headline fades out over the last quarter of the stop.

Per stone `i` (0 to 5), local progress `t` in [0, 1] over its stop:

- `t` 0.00 to 0.25, lift: stone translates from its socket toward the camera and the text side, scale 1 to 3, emissive intensity 0.2 to 2.5. Scene rim light lerps to the stone colour. Rail diamond `i` ignites. Text block rises in (Journey's card motion).
- `t` 0.25 to 0.75, hold: stone floats with a small sine bob. Text is fully readable.
- `t` 0.75 to 1.00, return: everything above reverses. Stone stays lit at emissive 0.8 once claimed so the gauntlet visibly fills up.

Gauntlet pose across the whole section: rotation.x from roughly -0.9 rad (knuckles tilted toward the viewer, fist low) to 0 (fist raised), rotation.y a slow +0.6 rad sweep, plus the idle tumble of ±0.03 rad. Camera fixed. Exact numbers are tuned by eye in the browser and recorded as constants at the top of `Gauntlet.tsx`.

Text layout per stone, copied from the reference: mono label `0N / 06 · MIND STONE` in the stone colour with a small square marker, project title in large wide-tracked uppercase (Geist, `tracking-[0.18em]`), tagline in `ink-dim`, tag chips as outlined mono pills, ghost numeral `0N` bottom-right at `text-[18vw]` in `white/[0.06]`. Text sits left, gauntlet sits centre-right, rail sits at the right edge.

Rail: six diamonds on a dashed vertical line at the right edge. Diamond `i` is `white/20` until stone `i` is claimed, then its stone colour with a 12px glow. Clicking a diamond scrolls the track to that stop.

## Components

All under `portfolio-app/src/`.

`components/sections/Stones.tsx` (client). Owns the pinned track, `useScroll`, the intro headline, six `StoneCard`s, `StoneRail`, `StoneVideo`, the `Gauntlet` canvas, and `openSlug` state for `ProjectSheet`. Reduced motion or the WebGL fallback render `<Work />` instead. Exposes nothing.

`components/sections/Gauntlet.tsx` (client). Props: `progress: MotionValue<number>`. Renders `<Canvas>` with `dpr={[1, 1.5]}`, `useGLTF('/models/gauntlet.glb')` with the drei Draco decoder path, drei `Environment preset="city"` for image-based lighting, one `SpotLight` whose colour is the rim light. In `useFrame` it reads `progress.get()`, computes the active stone and local `t`, and writes gauntlet rotation, stone position, scale and emissive directly to the loaded meshes. Socket rest positions are captured once at load from each stone mesh's initial transform. Wrapped by the parent in `WebGLBoundary defer`.

`components/sections/StoneVideo.tsx` (client). Props: `progress`, `stones`. Six absolutely positioned layers. Each holds a `<video muted loop playsInline preload="none" poster>` and a radial-gradient div in the stone colour. Layer opacity comes from a `useTransform` window around its stop. Only the active clip and its next neighbour call `play()`; the rest are paused. Below the `md` breakpoint the `<video>` is not rendered at all and the poster or gradient stands alone. A missing clip file falls back to the gradient via the video `onError`.

`data/stones.ts`. `export const stones: Stone[]` with `{ id, name, hex, mesh, slug }`, the six rows in the mapping table above. Also `export const veoPrompts` so the prompts live next to the data they feed.

`components/sections/Footer.tsx`. One added line: the CC-BY credit with links to the model and author.

`app/page.tsx`. `<Work />` import swapped for `<Stones />`.

`scripts/check-content.mjs`. One new check: every `stones[].slug` exists in `projects` and every `stones[].mesh` exists as a node name in `gauntlet.glb` (read the GLB JSON chunk, no three.js needed).

## Assets

Model, in place: `public/models/gauntlet.glb`, `public/models/LICENSE-gauntlet.txt`. Source zip was `manopla-infinito-3d-model.zip` from Sketchfab; the phantom left thumb (mesh-local x < -0.31, y < 0.1, -1.46 < z < -0.84) was removed by dropping 1,331 triangles before re-encoding.

Videos, in place: `public/media/stones/<stone>.mp4` plus a first-frame `<stone>.jpg` poster. Generated in Google Flow with Veo 3.1 Fast as smooth oval cabochons (not faceted gems), 720p, 16:9, re-encoded to H.264 with audio stripped, about 20 MB total. Five clips are 8 s; `soul.mp4` is 16 s because the source had a camera move, so it is ping-ponged (forward then reversed) to loop seamlessly. The prompts below are the originals and are superseded by the cabochon versions kept in `data/stones.ts`. Original prompts:

- `mind.mp4`: Photorealistic macro shot of a faceted golden yellow gemstone floating in black void, slow internal light pulsing like neural activity, fine dust motes drifting, shallow depth of field, no camera movement, seamless loop, cinematic lighting, 8 seconds.
- `soul.mp4`: Photorealistic macro shot of a deep orange gemstone hovering over a dark still lake, faint amber mist rising, slow warm glow breathing, black background, no camera movement, seamless loop, cinematic, 8 seconds.
- `reality.mp4`: Photorealistic macro shot of a crimson red gemstone in black void, liquid red energy slowly warping the air around it like heat haze, fine red particles, no camera movement, seamless loop, cinematic, 8 seconds.
- `space.mp4`: Photorealistic macro shot of a sapphire blue gemstone in black void, thin blue lightning threads crawling across its surface, cold blue volumetric glow, star-like dust, no camera movement, seamless loop, cinematic, 8 seconds.
- `power.mp4`: Photorealistic macro shot of a violet purple gemstone in black void, dense purple energy arcs crackling outward and fading, heavy glow, floating debris, no camera movement, seamless loop, cinematic, 8 seconds.
- `time.mp4`: Photorealistic macro shot of an emerald green gemstone in black void, slow rotating rings of green light orbiting it, faint clock-like ticking glow, fine green dust, no camera movement, seamless loop, cinematic, 8 seconds.

Clips are dimmed to about 35% opacity behind the gauntlet, so mild imperfections are acceptable. The build does not wait on the clips; the gradient fallback ships if they are absent.

## Performance and fallbacks

- One GL context, mounted only while the section is within 300px of the viewport (existing two-way `WebGLBoundary`).
- `dpr` capped at 1.5 on desktop, 1 below `md`.
- Reduced motion: `<Work />` grid, unchanged.
- WebGL context failure: `<Work />` grid via the boundary fallback.
- Videos: `preload="none"`, at most two playing, none on mobile.
- Draco decoder loaded from drei's default CDN path; if the static export must be fully offline, copy the decoder into `public/draco/` and point `useGLTF` at it.

## Testing

- `npm run build` runs the existing QA gate plus the new stones check. This is the only automated gate.
- Manual, in Chrome, desktop: scroll to each of the seven stops and confirm the correct stone lifts, the correct text shows, the rail count matches, and the ghost numeral matches. Scroll back to the top and confirm the sequence reverses cleanly. Open one sheet from a stone title and dismiss it by drag.
- Manual, 390px viewport: sequence runs, no video elements in the DOM, text remains readable over the gauntlet.
- Manual, reduced motion enabled in OS: the Work grid renders and no canvas mounts.

## Out of scope

Hero, Experience, Contact, and any other section. Sound. Per-stone routes. Replacing Journey's scroll engine. Regenerating the Veo clips.

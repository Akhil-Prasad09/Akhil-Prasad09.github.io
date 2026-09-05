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

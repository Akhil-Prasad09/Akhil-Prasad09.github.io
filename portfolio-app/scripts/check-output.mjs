// Mechanical spec-lock gate over the static export. Runs after `next build` via
// the `postbuild` script. Node >= 22.18 strips the .ts import natively, so this
// needs no loader and pulls nothing from the network on the build path.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { projects, certifications, roles, education } from "../src/data/content.ts";

const html = readFileSync("out/index.html", "utf8");

// Next inlines its RSC payload in <script> and the vendored bits inject <style>
// blocks. Neither is rendered copy, so the taste checks below run on markup with
// both stripped, or they trip over minified vendor strings and class literals.
const markup = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<style[\s\S]*?<\/style>/g, "");

let failures = 0;
const assert = (ok, msg) => {
  if (!ok) {
    console.error("FAIL:", msg);
    failures++;
  }
};

// Every data array reaches the page. A dropped or broken section fails here, and
// appending to content.ts extends the check for free.
for (const p of projects) assert(html.includes(p.title), `project missing: ${p.title}`);
for (const c of certifications) assert(html.includes(c.name), `certification missing: ${c.name}`);
for (const r of roles) assert(html.includes(r.org), `role missing: ${r.org}`);
for (const e of education) assert(html.includes(e.school), `education missing: ${e.school}`);

assert(!/[—–]/.test(markup), "em/en-dash in rendered copy");

// Spec lock: no section is viewport-height. Out-of-flow overlays (the mobile
// menu panel, the noise canvas) legitimately fill the viewport, so only in-flow
// uses fail.
const inFlowScreen = [...markup.matchAll(/class="([^"]*\bh-screen\b[^"]*)"/g)]
  .map((m) => m[1])
  .filter((cls) => !/\b(fixed|absolute)\b/.test(cls));
assert(inFlowScreen.length === 0, `h-screen on in-flow element: ${inFlowScreen.join(" | ")}`);

const eyebrows = (markup.match(/uppercase[^"]*tracking-\[/g) || []).length;
assert(eyebrows <= 4, `too many eyebrows: ${eyebrows}`);

assert(
  (markup.match(/aria-label="Technologies"/g) || []).length === 1,
  "expected exactly one marquee",
);

// Spec lock: no purple anywhere in the emitted CSS. Hex hues 250-330 and oklch
// hues 270-340 are the purple band; near-greys are skipped because hue is noise
// at low chroma. A stray Tailwind palette utility is the likeliest way purple
// sneaks in, and those emit oklch.
//
// Never write a literal utility class name in this file: Tailwind's source
// scanner reads scripts/ too and will generate the very colour we check for.
const cssDir = "out/_next/static";
const css = readdirSync(cssDir, { recursive: true })
  .filter((f) => String(f).endsWith(".css"))
  .map((f) => readFileSync(join(cssDir, String(f)), "utf8"))
  .concat(html.match(/<style[\s\S]*?<\/style>/g) || [])
  .join("");

const isPurpleHex = (hex) => {
  const raw = hex.slice(1);
  const h = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (!(d / max >= 0.15)) return false; // grey (or black): hue carries no intent
  const deg =
    60 * (max === r ? (((g - b) / d) % 6) + 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4);
  return deg % 360 >= 250 && deg % 360 <= 330;
};
const purple = [
  ...new Set(
    [...css.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map((m) => m[0]),
  ),
].filter(isPurpleHex);
const purpleOklch = [...css.matchAll(/oklch\(\s*[\d.%]+\s+([\d.]+)\s+([\d.]+)/g)]
  .filter((m) => Number(m[1]) > 0.03 && Number(m[2]) >= 270 && Number(m[2]) <= 340)
  .map((m) => m[0]);
assert(
  purple.length + purpleOklch.length === 0,
  `purple in emitted CSS: ${[...purple, ...purpleOklch].join(" ")}`,
);

if (failures) process.exit(1);
console.log("output OK");

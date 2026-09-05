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

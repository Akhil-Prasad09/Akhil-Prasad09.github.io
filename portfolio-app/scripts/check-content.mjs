import { projects, certifications, education, roles, stats, capabilities } from "../src/data/content.ts";
// Run by `npm run check`; assertions below are the acceptance contract. Counts
// are floors, not fixtures: appending to content.ts must never fail the gate.
const assert = (c, msg) => { if (!c) { console.error("FAIL:", msg); process.exit(1); } };
assert(projects.length >= 7, "at least 7 projects");
assert(projects.filter(p => p.tier === "featured").length === 2, "2 featured");
assert(new Set(projects.map(p => p.slug)).size === projects.length, "unique slugs");
assert(roles.length >= 4, "at least 4 roles");
assert(certifications.length >= 2, "at least 2 certifications");
assert(education.length >= 1, "at least 1 education entry");
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
scan({ projects, certifications, education, roles, stats, capabilities }, "content");
console.log("content OK");

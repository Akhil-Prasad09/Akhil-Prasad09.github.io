"use client";
import { projects } from "@/data/content";
import { stones } from "@/data/stones";
import { Work } from "./Work";

/** Projects that don't sit on a stone still get a place on the page, not only in the reduced-motion fallback. */
export function MoreWork() {
  const onStones = new Set(stones.map((s) => s.slug));
  const rest = projects.filter((p) => !onStones.has(p.slug)).map((p) => p.slug);
  if (rest.length === 0) return null;
  return <Work slugs={rest} heading="More projects" id="more-work" />;
}

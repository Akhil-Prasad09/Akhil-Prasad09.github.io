"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { roles, type Role } from "@/data/content";

/**
 * Sticky-stack, not the vendored ScrollStack. That component spins up its own
 * Lenis instance and either hijacks the window scroll or needs a fixed-height
 * internal scroller, both of which fight the page. CSS position:sticky does the
 * pinning for free; Motion only supplies the recede-and-dim on covered cards.
 */

const PIN_TOP = 88; // nav measures 58px, plus air so the pinned card clears it
const PIN_STEP = 14; // sliver of each covered card left visible

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-24">
      <h2 className="mb-10 text-4xl tracking-tighter">Experience</h2>
      <div ref={trackRef} className="relative">
        {roles.map((role, i) => (
          <RoleCard
            key={role.org}
            role={role}
            index={i}
            total={roles.length}
            progress={scrollYProgress}
            pinned={!reduced}
          />
        ))}
      </div>
    </section>
  );
}

function RoleCard({
  role,
  index,
  total,
  progress,
  pinned,
}: {
  role: Role;
  index: number;
  total: number;
  progress: MotionValue<number>;
  pinned: boolean;
}) {
  const range: [number, number] = [index / total, (index + 1) / total];
  const scale = useTransform(progress, range, [1, 0.92]);
  // Transformer-function form on purpose: useTransform only attaches its
  // .accelerate hint when arg2 is an array, and "filter" is in motion's
  // acceleratedValues, so the array form hands the dim to a WAAPI ViewTimeline
  // whose range does not match this JS progress span. A function keeps it on
  // the JS path. "scale" is not accelerable, which is why it needs no hatch.
  const dim = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, (p - range[0]) / (range[1] - range[0])));
    return `brightness(${1 - 0.4 * t})`;
  });
  const recedes = pinned && index < total - 1;

  return (
    <div
      className={pinned ? "sticky mb-[14vh] last:mb-0" : "mb-8"}
      style={pinned ? { top: PIN_TOP + index * PIN_STEP } : undefined}
    >
      <motion.article
        className="origin-top rounded-card border border-white/10 bg-surface-2 p-8 md:p-10"
        style={recedes ? { scale, filter: dim } : undefined}
      >
        <h3 className="text-2xl tracking-tight md:text-3xl">{role.org}</h3>
        <p className="mt-2 font-mono text-xs text-ink-dim md:text-sm">
          {role.title} / {role.period} / {role.location}
        </p>
        <div className="mt-6 space-y-3">
          {role.points.map((point) => (
            <p key={point} className="max-w-2xl leading-relaxed text-ink-dim">
              {point}
            </p>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

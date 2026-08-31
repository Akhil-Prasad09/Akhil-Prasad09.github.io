"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { NeuralFlow } from "@/components/media/NeuralFlow";

/**
 * Scroll-scrubbed expansion of a 16:9 generative canvas from a rounded inset
 * window to full bleed. The vendored ScrollExpand only accepts an image or
 * video URL as its media (children render as a late-fading overlay, not the
 * media itself), so the scrub is done here with useScroll + clip-path instead.
 * clip-path keeps the canvas at a constant pixel size, so scrubbing never
 * triggers layout or a canvas resize.
 */
export function MediaBridge() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.25"],
  });
  const inset = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;

  return (
    <section ref={ref} className="relative w-full py-24">
      <motion.div
        className="relative aspect-video w-full overflow-hidden bg-surface-2"
        style={reduced ? { borderRadius: 20 } : { clipPath }}
      >
        <NeuralFlow paused={Boolean(reduced)} />
      </motion.div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
  type PanInfo,
} from "motion/react";
import type { Project } from "@/data/content";
import { Z } from "@/lib/z";
import { project as projectMomentum } from "@/lib/motion";

const DISMISS_DISTANCE = 160;

export function ProjectSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  // Single writer for scrim opacity: derived from y and nothing else. y starts at the
  // sheet height on enter, so this doubles as the fade-in. Never rebind opacity via
  // initial/animate/exit — a second writer wins the first frame and kills the scrim.
  const scrimOpacity = useTransform(y, [0, 400], [1, 0]);
  const sheetRef = useRef<HTMLDivElement>(null);
  // Drag only while the inner scroller is at the top (iOS sheet pattern). A boundary
  // boolean, not a continuous value — React bails out when it doesn't change.
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  // a11y: move focus into the dialog on open, restore it to the trigger on close.
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus({ preventScroll: true });
    return () => returnTo?.focus({ preventScroll: true });
  }, []);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const projected = info.offset.y + projectMomentum(info.velocity.y);
    if (projected > DISMISS_DISTANCE && info.velocity.y >= 0) {
      animate(y, window.innerHeight, { type: "spring", bounce: 0, duration: 0.3, velocity: info.velocity.y }).then(onClose);
    } else {
      animate(y, 0, { type: "spring", bounce: 0.2, duration: 0.4, velocity: info.velocity.y });
    }
  }

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={project.title}
      className="fixed inset-0" style={{ zIndex: Z.sheet }}>
      <motion.button aria-label="Close" onClick={onClose}
        className="absolute inset-0 bg-black/60" style={{ opacity: scrimOpacity }} />
      <motion.div
        ref={sheetRef}
        tabIndex={-1}
        drag={reduce || !atTop ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.15, bottom: 0.6 }}   /* rubber-band up, loose down */
        dragMomentum={false}                        /* our animate() owns the release */
        style={{ y }}
        onDragEnd={handleDragEnd}
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        className="absolute inset-x-0 bottom-0 top-16 rounded-t-[20px] border-t border-white/10 bg-surface-2/90 backdrop-blur-2xl"
      >
        {/* Scroll surface is separate from the drag surface: Motion puts touch-action:pan-x
            and user-select:none on the dragged element, which would kill touch scrolling
            and text selection if the content lived there. */}
        <div
          onScroll={e => setAtTop(e.currentTarget.scrollTop <= 0)}
          className="h-full overflow-y-auto overscroll-contain rounded-t-[20px]"
        >
          <div aria-hidden className="sticky top-0 mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />
          <div className="mx-auto max-w-3xl px-6 py-10">
            <h3 className="text-3xl tracking-tighter">{project.title}</h3>
            <p className="mt-2 text-ink-dim">{project.tagline}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.metrics.map(m => (
                <div key={m.label} className="rounded-[20px] border border-white/10 p-4">
                  <div className="text-sm text-ink-dim">{m.label}</div>
                  <div className="font-mono text-xl">{m.value}</div>
                </div>
              ))}
            </div>
            {project.body.map(par => <p key={par.slice(0, 24)} className="mt-5 leading-relaxed text-ink-dim">{par}</p>)}
            <div className="mt-8 grid gap-4">
              {project.media.map(m => (
                <Image key={m.src} src={m.src} alt={m.alt} width={1200} height={800}
                  className="w-full rounded-[20px] border border-white/10" unoptimized={m.kind === "gif"} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

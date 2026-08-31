"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const NODES = 70;
const LINK_DIST = 120;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const SPEED = 14; // px per second
const TAU = Math.PI * 2;
const ACCENT = "#38bdf8";

/**
 * Drifting node/edge field on a transparent canvas. Fills its (positioned)
 * parent. `paused` or prefers-reduced-motion renders a single static frame
 * and never starts the rAF loop.
 */
export function NeuralFlow({ paused }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const still = Boolean(paused || reduced);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !ctx || !parent) return;

    // Allocated once. The frame loop only mutates these in place, so a
    // steady-state frame does zero heap allocation (no GC sawtooth).
    const x = new Float32Array(NODES);
    const y = new Float32Array(NODES);
    const vx = new Float32Array(NODES);
    const vy = new Float32Array(NODES);

    let w = 0;
    let h = 0;
    let seeded = false;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1;
      for (let i = 0; i < NODES; i++) {
        for (let j = i + 1; j < NODES; j++) {
          const dx = x[i] - x[j];
          const dy = y[i] - y[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST_SQ) continue;
          // globalAlpha rather than an rgba() string: no per-edge allocation.
          ctx.globalAlpha = 0.25 * (1 - Math.sqrt(d2) / LINK_DIST);
          ctx.beginPath();
          ctx.moveTo(x[i], y[i]);
          ctx.lineTo(x[j], y[j]);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = ACCENT;
      for (let i = 0; i < NODES; i++) {
        ctx.beginPath();
        ctx.arc(x[i], y[i], 1.6, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded) {
        for (let i = 0; i < NODES; i++) {
          x[i] = Math.random() * w;
          y[i] = Math.random() * h;
          const a = Math.random() * TAU;
          vx[i] = Math.cos(a) * SPEED;
          vy[i] = Math.sin(a) * SPEED;
        }
        seeded = true;
      }
      draw();
    };

    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      for (let i = 0; i < NODES; i++) {
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        if (x[i] < 0) x[i] += w;
        else if (x[i] > w) x[i] -= w;
        if (y[i] < 0) y[i] += h;
        else if (y[i] > h) y[i] -= h;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    if (!still) raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [still]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}

"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";

type Fallback = { children: ReactNode; fallback?: ReactNode };

/**
 * WebGL context creation fails on machines with no GPU, a blocklisted driver, or
 * hardware acceleration switched off. The vendored canvas bits log "unable to
 * create webgl context" and then dereference the null context, and that throw
 * happens inside React's commit phase: with no boundary it escalates to the root
 * and Next swaps the entire page for its error shell, so a visitor without WebGL
 * gets a blank document instead of the site.
 */
class Catch extends Component<Fallback, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}

/**
 * Wraps a WebGL canvas so a dead context degrades to `fallback` (nothing, by
 * default) instead of taking the page down.
 *
 * `defer` additionally holds the canvas unmounted until it scrolls near the
 * viewport. Every canvas costs a GL context and a requestAnimationFrame loop
 * from first paint, which is pure blocking time when it is three screens down
 * and nobody can see it. While deferred the wrapper renders the same fallback
 * inside a placeholder box, so `placeholderClassName` has to reproduce the
 * canvas's own footprint or the observer gets a zero-area target.
 */
export function WebGLBoundary({
  children,
  fallback = null,
  defer = false,
  placeholderClassName,
}: Fallback & { defer?: boolean; placeholderClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(!defer);

  useEffect(() => {
    if (near || !ref.current) return;
    // No IntersectionObserver (or no layout yet) should never mean "no canvas".
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);

  // Once mounted the placeholder is gone entirely, so the deferred tree ends up
  // structurally identical to the eager one.
  if (!near) {
    return (
      <div ref={ref} aria-hidden="true" className={placeholderClassName}>
        {fallback}
      </div>
    );
  }

  return <Catch fallback={fallback}>{children}</Catch>;
}

export default WebGLBoundary;

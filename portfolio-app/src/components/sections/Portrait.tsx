"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/data/content";

// ElasticMesh is a WebGL (ogl) canvas; it must not run during SSR or the
// static export build.
const ElasticMesh = dynamic(() => import("@/components/bits/ElasticMesh"), { ssr: false });

const SRC = "/media/portrait.webp";

/**
 * The portrait file may not exist yet. fs checks are not available client side,
 * so probe the URL and only mount the mesh once the image actually decodes.
 * Until then (and forever, if it 404s) the monogram tile stands in, which also
 * means the monogram is what the exported HTML ships: no broken-image flash.
 */
export function Portrait() {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasImage(true);
    img.onerror = () => setHasImage(false);
    img.src = SRC;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <div
      role="img"
      aria-label={`Portrait of ${profile.name}`}
      className="aspect-square w-full max-w-sm overflow-hidden rounded-card border border-white/10 bg-surface-2"
    >
      {hasImage ? (
        <ElasticMesh
          image={SRC}
          borderRadius={20}
          showGrid={false}
          highlight="#38bdf8"
          shading={0.45}
          tilt={10}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-7xl tracking-tighter text-ink-dim md:text-8xl"
        >
          AP
        </div>
      )}
    </div>
  );
}

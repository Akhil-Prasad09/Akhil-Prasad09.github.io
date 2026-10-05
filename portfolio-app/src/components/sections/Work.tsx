"use client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { projects } from "@/data/content";
import { WorkCell } from "./WorkCell";
import { ProjectSheet } from "./ProjectSheet";

export function Work({ slugs, heading = "Selected work", id = "work" }: { slugs?: string[]; heading?: string; id?: string } = {}) {
  const shown = slugs ? projects.filter(p => slugs.includes(p.slug)) : projects;
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return (
    <section id={id} className="mx-auto max-w-7xl overflow-x-clip px-4 py-24">
      <h2 className="mb-10 text-4xl tracking-tighter">{heading}</h2>
      <div className="grid grid-flow-dense grid-cols-1 gap-5 md:grid-cols-6 md:auto-rows-[minmax(180px,auto)]">
        {shown.map(p => (
          <WorkCell key={p.slug} project={p} onOpen={setOpenSlug} />
        ))}
      </div>
      <AnimatePresence>
        {openSlug && (
          <ProjectSheet
            project={projects.find(p => p.slug === openSlug)!}
            onClose={() => setOpenSlug(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

import ShinyText from "@/components/bits/ShinyText";
import { profile } from "@/data/content";

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-dim">
      <ShinyText text={profile.name} speed={3} color="#a1a1aa" shineColor="#38bdf8" />
      <p className="mt-1">{profile.role}</p>
    </footer>
  );
}

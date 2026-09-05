import ShinyText from "@/components/bits/ShinyText";
import { profile } from "@/data/content";

const link = "underline underline-offset-2 hover:text-ink";

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-dim">
      <ShinyText text={profile.name} speed={3} color="#a1a1aa" shineColor="#38bdf8" />
      <p className="mt-1">{profile.role}</p>
      <p className="mt-4 text-xs">
        Gauntlet model:{" "}
        <a href="https://sketchfab.com/3d-models/infinity-gauntlet-2d2ee90a237a44b68c5f7aa59a1c0fc2" className={link}>
          Infinity Gauntlet
        </a>{" "}
        by{" "}
        <a href="https://sketchfab.com/loghawk360" className={link}>
          Xorrrupted
        </a>
        ,{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/" className={link}>
          CC BY 4.0
        </a>
        .
      </p>
    </footer>
  );
}

"use client";

import PillNav from "@/components/bits/PillNav";
import { StaggeredMenu } from "@/components/bits/StaggeredMenu";
import GradualBlur from "@/components/bits/GradualBlur";
import { profile } from "@/data/content";
import { Z } from "@/lib/z";

const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const STAGGERED_ITEMS = NAV_ITEMS.map((item) => ({
  label: item.label,
  ariaLabel: `Go to ${item.label}`,
  link: item.href,
}));

// Header box caps at 64px (<=72px budget); GradualBlur sits just below it as a
// scroll-edge fade so content softens as it slides under the fixed nav.
const HEADER_HEIGHT = 64;

export function Nav() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 h-16" style={{ zIndex: Z.nav }}>
        <div className="hidden md:block">
          <PillNav
            logo="/logo-nav.svg"
            logoAlt={profile.name}
            items={NAV_ITEMS}
            baseColor="#38bdf8"
            pillColor="#131316"
            pillTextColor="#fafafa"
            hoveredPillTextColor="#09090b"
          />
        </div>
        <div className="md:hidden">
          <StaggeredMenu
            isFixed
            position="right"
            items={STAGGERED_ITEMS}
            displaySocials={false}
            displayItemNumbering={false}
            logoUrl="/logo-nav.svg"
            colors={["#131316", "#38bdf8"]}
            accentColor="#38bdf8"
            menuButtonColor="#fafafa"
            openMenuButtonColor="#09090b"
            className="staggered-nav-compact"
          />
        </div>
      </header>
      <div className="pointer-events-none fixed inset-x-0" style={{ top: HEADER_HEIGHT, zIndex: Z.nav - 1 }}>
        <GradualBlur
          target="parent"
          position="top"
          height="1.5rem"
          strength={1}
          opacity={0.5}
          divCount={4}
        />
      </div>
    </>
  );
}

---
name: Akhil Prasad Portfolio
description: Dark zinc vault, one azure signal, six stones of proof.
colors:
  accent-azure: "#38bdf8"
  surface: "#09090b"
  surface-raised: "#131316"
  ink: "#fafafa"
  ink-dim: "#a1a1aa"
  hairline: "rgba(255, 255, 255, 0.1)"
  hairline-strong: "rgba(255, 255, 255, 0.15)"
  hairline-faint: "rgba(255, 255, 255, 0.2)"
  scrim: "rgba(0, 0, 0, 0.6)"
  stone-mind: "#FFD700"
  stone-soul: "#FF7A1A"
  stone-reality: "#FF2D2D"
  stone-space: "#2D7CFF"
  stone-power: "#A234FF"
  stone-time: "#22E07A"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: "2.5rem"
    letterSpacing: "-0.05em"
  stone-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.18em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  numeral:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: "2.25rem"
  label-mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  eyebrow-mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
    letterSpacing: "0.3em"
rounded:
  media: "16px"
  card: "20px"
  page: "28px"
  pill: "9999px"
spacing:
  gutter: "16px"
  gutter-md: "32px"
  cell-gap: "20px"
  stack-gap: "24px"
  card-pad: "32px"
  card-pad-lg: "48px"
  heading-gap: "40px"
  section-y: "96px"
  container-wide: "80rem"
  container-reading: "64rem"
  container-sheet: "48rem"
components:
  button-ghost-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-ghost-pill-hover:
    textColor: "{colors.accent-azure}"
  link-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.eyebrow-mono}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  metric-tile:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.card}"
    padding: "16px"
  project-sheet:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "40px 24px"
---

# Design System: Akhil Prasad Portfolio

## Overview

**Creative North Star: "The Vault at Night"**

A near-black zinc room where every surface is a shade of the same dark, and a single azure signal marks what can be touched, followed, or trusted. The portfolio is built as an experience for recruiters and hiring engineers: scroll is the camera, sections pin and stack like physical pages sliding over one another, and the centerpiece is a 3D Infinity Gauntlet whose six stones each carry one project. Everything else stays quiet so the motion and the proof can speak.

Density is moderate and editorial: generous section rhythm (96px vertical), headlines set at regular weight with tight negative tracking, dim zinc body copy, and monospaced figures for anything measured (metrics, dates, benchmark rows, the identity card). Depth comes from tonal layering and hairline borders, not from shadows; the only heavy shadow is the one cast by a page riding over the page beneath it.

The React Bits component family (SplitText, TextType, DecryptedText, BorderGlow, SpecularButton, Silk, Beams, CountUp, PillNav, StaggeredMenu, TiltedCard, SpotlightCard, HalftoneReveal, ScrollVelocity, ShinyText, GlassIcons) is the native vocabulary of this world. Every WebGL piece sits inside a fallback boundary that renders a plain, on-palette equivalent; reduced motion swaps the gauntlet scroll for a static grid of the same projects.

**Key Characteristics:**
- Two zinc surfaces, one azure accent, white-alpha hairlines.
- Geist for words, Geist Mono for numbers and metadata.
- Regular-weight headlines with -0.05em tracking; no bold headings.
- 20px cards, full pills for actions and tags, 28px page edges.
- Scroll-driven pinning and page stacking; spring physics for direct manipulation.
- The six stone colors exist only inside the gauntlet section.

### Porting to standalone demo pages

Eight standalone demo pages (separate repos, plain HTML/JS or React) inherit this system through a shared stylesheet. The frontmatter tokens are written to port one-to-one into plain CSS custom properties. The incumbent names from `src/app/globals.css` are canonical and must be kept:

```css
:root {
  color-scheme: dark;
  --color-accent: #38bdf8;
  --color-surface: #09090b;
  --color-surface-2: #131316;
  --color-ink: #fafafa;
  --color-ink-dim: #a1a1aa;
  --color-hairline: rgba(255, 255, 255, 0.1);
  --color-hairline-strong: rgba(255, 255, 255, 0.15);
  --color-hairline-faint: rgba(255, 255, 255, 0.2);
  --color-scrim: rgba(0, 0, 0, 0.6);
  --radius-media: 16px;
  --radius-card: 20px;
  --radius-page: 28px;
  --radius-pill: 9999px;
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --z-work: 10; --z-experience: 20; --z-tail: 30; --z-nav: 40; --z-sheet: 50;
}
body { background: var(--color-surface); color: var(--color-ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

Token-name map: frontmatter `accent-azure` is `--color-accent`; `surface-raised` is `--color-surface-2`. Demo pages load Geist and Geist Mono themselves (Google Fonts or `@fontsource`), since `next/font` is not available outside the Next app.

## Colors

A monochrome zinc dark with one cold azure voice; color beyond that is reserved for the six stones.

### Primary
- **Azure Signal** (accent-azure): the one accent. Hover state of every ghost pill and link-pill (border and text), the focus-visible outline on every control (2px, 2px offset), the SpecularButton tint and line, BorderGlow glow (`198 93 60` HSL), SpotlightCard spotlight at 14% alpha, Beams light in Contact, ShinyText shine, the active PillNav fill, benchmark row indices, and the TechMarquee wordmark strip at 20% alpha.

### Tertiary (scoped)
- **The Six Stones** (stone-mind gold, stone-soul orange, stone-reality red, stone-space blue, stone-power violet, stone-time green): one per project in the gauntlet section. Applied only via inline style to the stone eyebrow label, its 8px square swatch, and the lit rail diamond with a `0 0 12px` glow in the same hue.

### Neutral
- **Vault Black** (surface): page background, StackViewport pages, the tail page, mobile menu panel.
- **Raised Zinc** (surface-raised): cards, the identity card, the project sheet (at 90% with a 40px backdrop blur), PillNav bar at 60%.
- **Bright Ink** (ink): headlines and primary text. Zinc-50, deliberately not pure white.
- **Dim Ink** (ink-dim): body paragraphs, taglines, labels, metadata, footer. The default for anything that is not a heading.
- **Hairline** (hairline): card borders, dividers, the sheet top edge, metric tiles, list rules.
- **Hairline Strong** (hairline-strong): borders of tag chips and link pills.
- **Hairline Faint** (hairline-faint): sheet drag handle, unlit rail diamonds, dashed rail connector.
- **Scrim** (scrim): behind the project sheet; opacity is derived from sheet position.

### Named Rules
**The One Voice Rule.** Azure is the only accent outside the gauntlet. It marks interaction (hover, focus, primary CTA) and ambient light, never a second content category.

**The Stones Stay Home Rule.** Stone hues appear only inside the six-stones section, bound to their own project. They never become general UI colors.

**The Not-White Rule.** Text is `#fafafa` or `#a1a1aa`; pure `#fff` is not a text color here.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace)

**Character:** A single neo-grotesk set at regular weight, pulled tight for headlines, paired with its mono sibling for every number, date, and machine-flavored line. Engineering-precise, never shouty.

### Hierarchy
- **Display** (400, 3rem below md / 3.75rem at md+, line-height 1, -0.05em): the hero line only, animated in with SplitText.
- **Headline** (400, 2.25rem, 2.5rem, -0.05em): every section h2 ("Selected work", "Experience", "Capabilities", "Education", "Get in touch"), with a 40px gap below. The Stones intro steps up to 3.75rem at md.
- **Stone Title** (400, 2.25rem below md / 3rem at md+, 1.05, +0.18em, uppercase): the per-stone project name in the gauntlet section. The only wide-tracked, uppercase sans in the system.
- **Title** (400, 1.25rem, -0.025em): card h3s and education entries; 1.5rem for experience card org names.
- **Body** (400, 1rem, line-height 1.625): paragraphs in ink-dim, capped at max-w-md (28rem) beside visuals and max-w-3xl (48rem) in the sheet. The hero subline (TextType) runs at 1.125rem / 1.25rem.
- **Body Small** (400, 0.875rem): taglines, metric labels, footer, link pills.
- **Numeral** (Geist Mono 400, 1.875rem): metric values (CountUp); 1.25rem inside sheet metric tiles.
- **Label Mono** (Geist Mono 400, 0.875rem): dates, roles, the hero identity card, benchmark rows.
- **Eyebrow Mono** (Geist Mono 400, 0.75rem, +0.3em, uppercase): the stone counter label ("01 / 06 · Mind Stone"); tag chips use the same face at 0.75rem without tracking.

### Named Rules
**The Light Hand Rule.** Headings are weight 400; hierarchy comes from size and tight tracking. Bold is reserved for decorative giant type (ghost stone numerals at 18vw and 6% white, the TechMarquee strip).

**The Numbers Are Mono Rule.** Any measured value, date, or index is set in Geist Mono.

## Layout

Single-column scroll story: Hero, Metrics, Stones (pinned), Experience (pinned), then a "tail" page (TechMarquee, Capabilities, Benchmarks, Education, Contact) that rides over the experience handover as one rounded sheet, then Footer.

- **Gutters:** 16px on mobile, 32px from md (Hero switches at lg).
- **Containers:** 80rem for grids (Work, Capabilities, Metrics, Footer); 64rem for reading sections (Experience list, Benchmarks, Education, Contact); 48rem inside the project sheet.
- **Rhythm:** sections pad 96px top and bottom (Metrics 64px, marquee 48px). Grid gaps are 20px for cards, 24px for stacked cards, 32px for metric columns, 48-64px between Contact's portrait and copy.
- **Grids:** Work is a dense 6-column bento (featured cells span 3x2, others 2x1, rows min 180px). Capabilities is a 5-column grid with alternating 3/2 then 2/3 spans for an asymmetric break. Hero is 7fr/5fr at lg. Metrics is 2 columns, 5 at md.
- **Pinning:** Stones allot 120vh of scroll per stop (one intro stop plus six stones) plus a 100vh handover; each pinned page is a sticky 100dvh viewport.
- **Breakpoints:** Tailwind defaults, sm 640px, md 768px, lg 1024px. Nav switches from PillNav to StaggeredMenu below md.
- **Z layers** (from `src/lib/z.ts`): work 10, experience 20, tail 30, nav 40, sheet 50. Stacked pages slide over each other in DOM order and always stay under the nav; the sheet is above everything.

## Elevation & Depth

Flat by tonal layering: Vault Black below, Raised Zinc above, white-alpha hairlines for edges. Shadows are not used on cards. Depth is instead carried by three devices: the page-stack shadow when one full-viewport page slides over another, light (BorderGlow, SpotlightCard, Beams, Silk) that behaves like illumination rather than elevation, and glass (backdrop blur) on chrome that floats over content.

### Shadow Vocabulary
- **Page Lift** (`box-shadow: 0 -30px 80px rgba(0,0,0,0.55)`): the leading edge of a StackViewport page and the tail page as they ride over the page beneath.
- **Stone Glow** (`box-shadow: 0 0 12px <stone hex>`): a lit rail diamond only.

### Named Rules
**The Light Not Lift Rule.** Cards do not cast shadows. Emphasis comes from glow and spotlight in azure, which the surface reacts to under the pointer.

**The Recede Rule.** A page being covered scales to 0.94 and dims toward surface at up to 60% opacity, and its corners round to 28px as it leaves.

## Shapes

Soft rectangles and full pills. Cards and containers use 20px corners; media nested inside a card drops to 16px so the inner curve sits concentric with the 20px outer edge at 20px padding. Whole pages that move (stack viewports, the tail page) carry 28px leading corners. Every action, link chip, tag, and nav item is a full pill. Borders are 1px white-alpha hairlines. The one sharp form is the stone rail: 10px squares rotated 45 degrees into diamonds on a dashed vertical line, plus the 8px square swatch in the stone eyebrow.

## Components

### Buttons
Tactile and lit, with a quiet ghost twin.
- **Shape:** full pill (9999px).
- **Primary CTA:** SpecularButton (WebGL, size lg) with ink text, azure tint at 10% and azure line, auto-animated. It is wrapped in a real `<a>` that owns the href and label; the inner button is aria-hidden and untabbable. WebGL fallback: a 1px azure-bordered pill, ink text, 12px 24px padding.
- **Ghost Pill:** 1px ink-dim border, ink text, 12px 24px; hover turns border and text azure (150ms color transition).
- **Link Pill (sheet):** 1px hairline-strong border, 0.875rem text, 6px 16px, trailing arrow; same azure hover.
- **Focus:** 2px solid azure outline, 2px offset, on every interactive element (4px offset on stone titles).
- **Press:** clickable cards scale to 0.98 on active.

### Chips
- **Style:** tag chips are full pills with a hairline-strong border, Geist Mono 0.75rem in ink-dim, 4px 12px, no fill.
- **State:** static; no selected state exists.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** Raised Zinc.
- **Shadow Strategy:** none; see Light Not Lift.
- **Border:** 1px hairline. Interactive cards use BorderGlow (azure glow at 0.4 intensity tracking the pointer); Capabilities cards use SpotlightCard with a 14% azure spotlight.
- **Internal Padding:** 32px (48px on the Benchmarks panel at md); work cells 20px; sheet metric tiles 16px with no fill.

### Navigation
- **Desktop (md+):** PillNav, a floating pill cluster at the top in a 64px header. Bar is Raised Zinc at 60% with its own backdrop blur; pills are transparent with ink text; hover fills azure with Vault Black text. No full-width blur bar.
- **Mobile:** StaggeredMenu from the right, panels layered Raised Zinc then azure, panel background Vault Black, items in ink, toggle ink turning azure when open. Header padding compacted to 12px 16px to stay within the 72px nav budget.

### Project Sheet (dialog)
A bottom sheet that rises to 64px below the top. Raised Zinc at 90% with a 40px backdrop blur, 20px top corners, hairline top border, a 48x6px faint-hairline handle that is the only drag surface. Content in a 48rem column: headline-size title (1.875rem, -0.05em), tagline, link pills, a 2-column grid of mono metric tiles, body paragraphs, 20px-rounded media. Scrim opacity derives solely from sheet position. Enters on a spring (bounce 0.2, 0.45s); dismisses by flick (projected momentum past 160px, spring bounce 0, 0.3s), Escape, or scrim click. Focus moves in on open and returns to the trigger on close. Reduced motion uses an opacity fade.

### Six Stones (signature)
The Work section as a pinned scroll track. A 3D gauntlet (three.js) poses and lifts each stone in turn while a looping stone video crossfades behind it. Per stop: the stone eyebrow in its own hue, the uppercase wide-tracked project title as a button that opens the Project Sheet, a dim tagline, tag chips, and a ghost numeral (Geist Mono bold, 18vw, white at 6%) bleeding off the bottom-right. Text rises 48px in over the first quarter of the stop, holds, then lifts out 32px. A right-edge rail of six diamonds ignites and stays lit as stones are claimed; clicking jumps to that stop. Reduced motion or a failed WebGL context renders the static Work bento instead, with identical data.

### Motion language
- **Springs** (`src/lib/motion.ts`): default spring is bounce 0, 0.4s; momentum spring is bounce 0.2, 0.35s. Flick-to-dismiss projects release velocity with deceleration 0.998.
- **Scroll-linked:** a single progress value owns every visual in a pinned section; reversing scroll replays it backward. Ranges are padded to span 0..1 (`span01`).
- **CSS state transitions:** color and opacity only, 150ms standard ease.
- **Text entrances:** SplitText (hero), TextType loop (hero subline), DecryptedText (Benchmarks headline), CountUp (metrics), AnimatedContent fades (0.6s).
- **Reduced motion:** a global rule collapses all CSS animation and transition time, and every scroll-pinned experience swaps to a static layout.

## Do's and Don'ts

### Do:
- **Do** keep every surface on Vault Black (#09090b) or Raised Zinc (#131316) and draw edges with 1px white-alpha hairlines (10%, 15%, 20%).
- **Do** use azure (#38bdf8) for hover, focus (2px outline, 2px offset), the primary CTA, and ambient light, and nowhere as a content color.
- **Do** set headings at weight 400 with -0.05em tracking (-0.025em for titles) and put every number, date, and index in Geist Mono.
- **Do** use 20px corners for cards, 16px for media nested inside them, 28px for moving pages, and full pills for actions, tags, and nav.
- **Do** wrap every WebGL component in a fallback that renders a plain, on-palette equivalent, and give every scroll-pinned experience a static reduced-motion layout with the same content.
- **Do** keep stacked pages and chrome on the z ladder: work 10, experience 20, tail 30, nav 40, sheet 50.
- **Do** use springs (bounce 0, 0.4s default) for anything the user drags or flicks.

### Don't:
- **Don't** introduce a second accent; the six stone hues are the only other colors and they stay inside the gauntlet section.
- **Don't** use pure white (#fff) for text or bold weights for headings.
- **Don't** put drop shadows on cards; the only shadow is the page-lift edge (0 -30px 80px rgba(0,0,0,0.55)) and the lit stone diamond glow.
- **Don't** add a full-width blurred nav bar; the nav is a floating pill cluster with its own blur.
- **Don't** animate anything outside reduced-motion control, or let a sheet's scrim opacity be written by more than one source.
- **Don't** leave a vendored React Bits component on its stock palette (white panels, neutral-900 cards, rounded-3xl); reskin it to these tokens.

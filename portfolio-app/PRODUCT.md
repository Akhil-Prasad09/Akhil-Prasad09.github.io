# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring engineers filling AI/ML or Python backend roles (Hyderabad or remote). They skim the portfolio in under a minute, decide whether Akhil is worth a call, then open one or two live demos, a GitHub repo, or the resume PDF. Engineers who do click through will read READMEs, results tables and code, so every claim on the site has to survive that check.

## Product Purpose

Personal portfolio of Akhil Prasad Chinthala, a final-year B.Tech IT student (CGPA 8.64) working as an AI Engineering Intern at AMIK Technologies and a freelance AI trainer at Handshake AI. Success: a hiring visitor leaves knowing what he builds, has tried at least one demo, and has a way to contact him or download the resume.

## Positioning

Live, measured, honest. Every project has a working demo and real numbers with their limits stated: the emotion tracker's 70.6% on FER-2013 (and the 60.5% browser-pipeline number), the RAG evaluation with bootstrap confidence intervals and a 33% to 75% refusal gain, the E2EE chat's malicious-server key-swap test. The site never rounds up a number or hides a limitation.

## Operating Context

- Site: Next.js 16 static export on GitHub Pages at https://akhil-prasad09.github.io (repo Akhil-Prasad09/Akhil-Prasad09.github.io, app in portfolio-app/, content in src/data/content.ts).
- Live demos are separate static pages on GitHub Pages, each in its own repo: cag-emotion-tracker, knee-mri-detect, ev-apm-agent-demo, e2ee-chat, gesture-media-controller, clinic-booking-voice, Projects (Green Basket). Most run ML models or crypto entirely in the visitor's browser (ONNX Runtime Web, MediaPipe, WebCrypto) and ask for webcam or file access.
- Visitors arrive from the resume PDF, LinkedIn, and GitHub profile links.

## Capabilities and Constraints

- Static hosting only: no server code, no secrets; demos must run client-side.
- Content checks run on build (scripts/check-content.mjs): tagline length, body paragraph count, real-number metrics.
- Third-party data rules: no MRNet scans, no RBI text, no real EV fleet data may ever be published; demos use user uploads or synthetic data.
- The RBI FEMA RAG project has no live demo by decision (RBI terms, LLM hosting).

## Brand Commitments

- Infinity Gauntlet / six stones concept: six featured projects mapped to Mind, Soul, Reality, Space, Power and Time stones (src/data/stones.ts) with stone videos and a 3D gauntlet. The user chose to keep this concept.
- Plain, specific wording: no em or en dashes, no hype vocabulary (see the user's writing-style preference).
- The user likes React Bits (reactbits.dev), Magic UI (magicui.design) and Animmaster (animmasterlib.dev) style components.

## Evidence on Hand

- Resume PDF: public/Akhil_Prasad_Resume.pdf (source: ../resume/Akhil_Prasad_Resume.tex).
- Project media in public/media (Grad-CAM images, EV GIF/chart/architecture SVG, generated posters, stone videos at 1280x720).
- Measured results in each repo's README and results files.
- No testimonials, client logos or press exist; never fabricate them. The booking platform was never used by a real client.

## Product Principles

1. Proof over adjectives: a demo link or a measured number beats a description.
2. Honest limits are a feature: show the caveat next to the claim.
3. Fast path for skimmers: name, role, best work and contact within the first screen; depth one click away.
4. Demos feel like one family with the portfolio, so the jump from the site to a demo doesn't feel like leaving.

## Accessibility & Inclusion

Respect prefers-reduced-motion everywhere (the site leans on motion and WebGL), keep text readable over video and 3D, keyboard-reachable controls in every demo, and graceful fallbacks when WebGL, WebGPU, camera or microphone are unavailable.

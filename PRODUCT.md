# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Recruiters and hiring managers for network, cloud and security roles, including internships (Summer 2027). They arrive from a résumé, LinkedIn or an application link and decide in seconds who Yuuki is and whether the work is real. A separate freelance page is planned; this site is not for clients.

## Product Purpose
Yuuki Burleigh's personal portfolio: show who he is as a Network & Cloud Professional, prove it with verifiable certifications and hands-on lab write-ups, and get the recruiter to make contact. Success: a recruiter emails him.

## Positioning
Every claim is checkable: three certifications with official verify links, and twelve lab write-ups as full PDFs (configs, screenshots, proof of functionality), plus real IT work at Ameri-tide.

## Capabilities and Constraints
- Vite + React single page on GitHub Pages; merging to `main` deploys.
- Lab PDFs open in an in-page viewer with zoom (pdf.js, lazy).
- Primary action: email (mailto). Secondary: LinkedIn, GitHub.
- Previous versions preserved: tag `v1-signal-path` / branch `archive/v1-signal-path` (live v1), branch `ship/redesign-v2` (rejected v2).

## Brand Commitments
Name: Yuuki Burleigh. Title: Network & Cloud Professional. Voice: technical, precise, professional. Visual identity is open (redesign-v3, 2026-10-12: "design it fresh"); no colour is binding. Light/dark toggle required, dark default.

## Evidence on Hand
- Certs: Cisco CCNA, AWS Cloud Practitioner, CompTIA Security+ — `src/data/certs.js` (verify URLs, badges in `public/badges/`).
- Labs: 12 PDFs — `src/data/labs.js`, `public/labs/`.
- Experience: IT Technician, Ameri-tide (Aug 2026–present) — `src/components/Experience.jsx`.
- Media: no hero footage on main. Rejected v2 films live on branch `ship/redesign-v2` / tag `redesign-v2-videos` only.
- No testimonials, metrics, years-of-experience or project counts beyond the above exist. Never invent them.

## Product Principles
1. Proof over claims: every statement links to evidence.
2. A recruiter must never get lost: clear first viewport, obvious next step.
3. Attention in the hero, calm reading below it.
4. Real facts only.

## Accessibility & Inclusion
WCAG AA contrast in both themes; full use under reduced motion; keyboard-operable viewer and toggle.

## Anti-goals (user, 2026-10-12)
Generic boxes/cards; no context on arrival (name + animation with no cue to the labs); main hero action off-frame on a phone; console/terminal cosplay; "Too Generic, AI Slop, Bad Copy, Bad UI-UX".

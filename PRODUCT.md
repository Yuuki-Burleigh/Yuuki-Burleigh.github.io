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
- Previous version preserved as git tag `v1-signal-path` / branch `archive/v1-signal-path`.

## Brand Commitments
Name: Yuuki Burleigh. Title: Network & Cloud Professional. Voice: technical, precise, console-flavoured but professional. Accent stays amber (user reverted the blue idea, 2026-10-11). Light/dark toggle required, dark default.

## Evidence on Hand
- Certs: Cisco CCNA, AWS Cloud Practitioner, CompTIA Security+ — `src/data/certs.js` (verify URLs, badges in `public/badges/`).
- Labs: 12 PDFs — `src/data/labs.js`, `public/labs/`.
- Experience: IT Technician, Ameri-tide (Aug 2026–present) — `src/components/Experience.jsx`.
- Media: hero film `public/media/path/m1.mp4`..`m7.mp4` (Kling 3.0 Pro, packet path cable to switch, router, firewall, VPN, cloud, AI and back) with device hold stills `stop1..6.webp` and `start.webp`. The v1 Signal Path footage and Hunyuan3D firewall model live only in tag `v1-signal-path`.
- No testimonials, metrics, years-of-experience or project counts beyond the above exist. Never invent them.

## Product Principles
1. Proof over claims: every statement links to evidence.
2. A recruiter must never get lost: clear first viewport, obvious next step.
3. Attention in the hero, calm reading below it.
4. Real facts only.

## Accessibility & Inclusion
WCAG AA contrast in both themes; full use under reduced motion; keyboard-operable viewer and toggle.

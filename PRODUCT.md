# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audiences are media executives, hiring managers, collaborators, press, event producers, and people searching for experienced podcast, television, and creative-technology leaders. Search engines and AI retrieval systems are an additional audience for the factual publishing layer.

## Product Purpose

The portfolio presents Jeanine Emilia Cornillot's production career, authorship, and Ghost Mode Labs work as one coherent practice. It should let a human visitor experience the work visually while giving crawlers and retrieval systems stable, accurate text they can read without running the portfolio application.

## Positioning

Jeanine is an Emmy- and Ambie-winning executive producer and showrunner who combines established editorial judgment with practical experimentation in AI and emerging formats.

## Operating Context

The public portfolio is a long-form, editorial React experience. The press kit supports journalists, event producers, and hiring teams with reusable biography and credential material. Static HTML, Markdown, JSON, PDF, sitemap, and crawler directives provide a factual discovery layer alongside the JavaScript experience.

## Capabilities and Constraints

- The expressive portfolio uses Vite, React, TypeScript, and hash routing.
- Important professional facts must also exist at ordinary, crawlable URLs without depending on client-side rendering.
- Public claims, awards, roles, quotations, and project descriptions must remain source-faithful and must not be fabricated or inflated.
- The canonical press data generates the HTML, Markdown, JSON, llms.txt, and PDF artifacts.
- Publishing or deployment happens through the repository's existing Git and Vercel workflow.

## Brand Commitments

The identity is fresh, editorial, premium, and human. It uses a bright poppy field, powder blue, warm paper, near-black ink, Bodoni Moda display type, Source Serif 4 body type, and Uncut Sans utility type. Copy is warm, intelligent, direct, and free of generic AI language. User-facing copy does not use em dashes.

## Evidence on Hand

- Production credits and project descriptions in `pages/ProductionsPreviewPage.tsx`, `pages/LabsPreviewPage.tsx`, and `constants.ts`.
- Canonical biography, awards, selected work, book information, quotations, and attribution notes in `content/press-data.json`.
- Designed press page in `public/press.html` and generated machine-readable assets in `public/press.md`, `public/press.json`, and `public/llms.txt`.
- Verified public profiles include LinkedIn, IMDb, and the Beacon Press page for *Family Sentence*.

## Product Principles

1. Let the human-facing portfolio remain expressive while making every important fact available in ordinary text.
2. Use one factual source wherever possible so public and machine-readable versions do not contradict each other.
3. Favor verifiable specificity over keyword repetition or inflated claims.
4. Make press, hiring, and discovery paths useful to people first, even when they also serve crawlers.

## Accessibility & Inclusion

Pages should remain readable without JavaScript, support keyboard navigation and visible focus states, preserve meaningful heading structure, respect reduced-motion preferences, and maintain WCAG AA text contrast.

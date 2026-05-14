---
name: marketing-site-editor
description: Use whenever the user asks to edit any part of this marketing site, add or remove sections, change copy, swap colors, add a page, or update images. Triggers on requests like "change the headline", "add a pricing section", "make it use green instead of blue", "add a new page for our blog", or any reference to editing site content.
---

# Marketing site editor

This skill is for editing the Astro + Tailwind marketing site in this repo. The user is a non-technical founder describing changes in plain English. Translate to code.

## Site map

```
src/pages/         ← one file per route
src/components/    ← reusable sections (Hero, FeatureGrid, CTA, etc.)
src/layouts/       ← BaseLayout wraps every page with header/footer/<head>
public/images/     ← all images, referenced as /images/filename.ext
public/favicon.svg ← favicon
src/styles/global.css ← Tailwind import + a couple of font defaults
src/pages/api/demo.ts ← serverless function for the demo form
```

## Component catalog

- **`Header.astro`** — sticky top nav, logo + nav links + Sign in + Start free trial button. Adds a border-bottom after 10px scroll via inline JS. Update `navItems` to add/remove nav links.
- **`Footer.astro`** — site-wide footer with logo, nav, social icons, copyright. Hard-coded; edit in place.
- **`Hero.astro`** — top-of-page block: headline, subhead, two CTAs, product mockup placeholder. Accepts `headline`, `subhead`, `primaryCta`, `secondaryCta` props.
- **`FeatureGrid.astro`** — 3-column grid of small features with icons. Use for 3-6 short capabilities. Accepts `eyebrow`, `heading`, `subhead`, `features[]` (each with `title`, `description`, `icon`). Icon options: `clock`, `message`, `chart`, `shield`, `zap`, `users`.
- **`FeatureSplit.astro`** — two-column text block: heading + description on one side, bullets on the other. Use for 1-3 features that need more explanation. Accepts `eyebrow`, `heading`, `description`, `bullets[]`, `bulletsSide` (`'left' | 'right'` — alternate across sections for visual rhythm).
- **`Testimonial.astro`** — single quote block. Accepts `quote`, `name`, `title`, `company`.
- **`CTA.astro`** — centered headline + button at bottom of every page. Accepts `heading`, `subhead`, `cta`, `secondaryCta` (pass `null` to suppress the secondary link — useful when the primary CTA already points to `/demo`).
- **`PricingTable.astro`** — 3-tier pricing. Accepts `tiers[]` (each with `name`, `price`, `priceSuffix`, `description`, `features[]`, `cta`, `featured?`). Mark exactly one tier as `featured: true` to highlight it.
- **`FAQ.astro`** — `<details>`-based accordion. Accepts `heading`, `items[]` (each with `q`, `a`). No JS.
- **`DemoForm.astro`** — the only component that ships with JS. Posts to `/api/demo`. Fields: name, email, company, message (optional), website (honeypot). If you add a field, also add it to `src/pages/api/demo.ts`'s email body.

## Adding a new section

1. Pick the closest existing component to clone (`FeatureGrid` for a list of small things, `FeatureSplit` for a single feature with detail, `CTA` for a centered banner, `Testimonial` for a quote).
2. Copy that file in `src/components/` to a new name describing what the section is (`LogoCloud.astro`, `StatsBar.astro`).
3. Update content. Keep the same outer structure: `<section class="bg-*">` → `<div class="mx-auto max-w-6xl px-6 py-20 md:py-24">`.
4. Import it at the top of the target page (`src/pages/index.astro`) and place the tag in the order you want.

## Adding a new page

1. Copy `src/pages/about.astro` to `src/pages/[name].astro`.
2. Update the `<BaseLayout title=... description=...>` props.
3. Replace the body content.
4. Open `src/components/Header.astro` and add `{ href: '/your-page', label: 'Your Page' }` to `navItems`.

## Adding a brand color (default is monochrome)

The starter ships monochrome on purpose — near-black accents on white, no chromatic accent. This means the founder's brand color can drop in cleanly without fighting an existing palette.

The classes that use `zinc-950` as an *accent* (not as heading text) are:

- Primary buttons: `bg-zinc-950 hover:bg-zinc-800` in `Hero.astro`, `CTA.astro`, `Header.astro`, `DemoForm.astro`, `PricingTable.astro`
- Featured pricing tier ring + badge: `border-zinc-950 ring-zinc-950` and `bg-zinc-950` (badge) in `PricingTable.astro`
- Form focus state: `focus:border-zinc-950 focus:ring-zinc-950/20` in `DemoForm.astro`
- Logo: hex `#0a0a0a` in `Header.astro`, `Footer.astro`, `public/favicon.svg`

To add the founder's brand color (e.g. emerald):
1. Replace `bg-zinc-950` → `bg-emerald-600` (buttons, badge)
2. Replace `hover:bg-zinc-800` → `hover:bg-emerald-700`
3. Replace `border-zinc-950 ring-zinc-950` → `border-emerald-600 ring-emerald-600`
4. Replace `focus:border-zinc-950 focus:ring-zinc-950/20` → `focus:border-emerald-600 focus:ring-emerald-600/20`
5. Replace the hex `#0a0a0a` in the three logo locations with the brand color hex (emerald-600 = `#059669`)

**Do not touch** `text-zinc-950` on headings, `text-zinc-600/700` on body, `bg-zinc-50/100/200` on backgrounds and dividers, or `bg-zinc-100 text-zinc-700` on avatar circles — those are intentionally neutral and stay neutral after the brand-color swap.

After the replace, run `npm run build` to confirm nothing missed.

## Copy guidelines (when the founder asks you to write)

- **Short sentences.** Active voice.
- **Benefit-led headlines**, not feature-led. "Standups without the meetings" beats "Async standup tool."
- **No jargon, no superlatives without evidence.** Don't say "revolutionary," "best-in-class," "game-changing."
- **6–10 word headlines.** One clear sentence for subheads.
- **Specific over vague.** "45 minutes back every morning" beats "save time."

## Image handling

- Reference as `/images/filename.ext` (the `public/` prefix is implicit).
- If the founder mentions an image that isn't in `public/images/`, walk them through uploading via GitHub's web UI: navigate to the `public/images/` folder, click "Add file" → "Upload files", drag and drop, commit.

## Verification

After every change: run `npm run build`. If it fails, fix it before opening the PR. Don't push broken code to the founder's main branch — Vercel will redeploy on merge.

## Common additions as the founder grows

The starter intentionally omits sections that early-stage founders don't have content for yet. Know how to add them when asked:

- **Logo cloud / customer logos.** Create `LogoCloud.astro`. Use plain-text or simple SVG placeholders for logo slots and leave a note in `public/images/README.md` style telling the founder to drop logo files into `public/images/customer-logos/`. Typically placed right after the Hero on home.
- **Case studies / customer stories.** Either add a single `CaseStudy.astro` on home (image + quote + outcome stat), or create a new `/customers` page using `about.astro` as a structural template.
- **Stats / social proof bar.** A simple component with 3-4 number-and-label pairs ("12,000 daily standups", "500+ teams"). Only add when the founder has real numbers — fake stats erode trust.
- **Integrations grid.** The `FeatureSplit` component already supports `visual="integrations"` for a small inline version; for a full page, create `/integrations.astro` modeled after `about.astro`.

## What not to do

- Don't add new dependencies. If a founder wants something fancy, do the simplest version that ships without a library.
- Don't introduce gradients, glassmorphism, scroll-triggered animations, or "AI startup" purple-pink palettes. Stay Linear/Vercel-style.
- Don't write Lorem Ipsum. If placeholder is needed, write believable copy for the founder's stated industry.
- Don't switch component patterns mid-project. Match what's already there.

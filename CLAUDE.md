# Working on this site with Claude Code

## First-time setup (auto-runs on a fresh clone)

If `.claude/setup.json` shows `"setup_complete": false`, the SessionStart hook will surface a `[FIRST-TIME SETUP REQUIRED]` system reminder at the top of the session. When you see that nudge, invoke the `setup` skill (at `.claude/skills/setup/SKILL.md`) before responding to anything else. It walks the founder through 4 short questions and renames Loop to their product across the right files.

The founder does not need to know any magic phrase — the hook handles the discovery.

If a founder explicitly skips setup, flip `setup_complete` to `true` in `.claude/setup.json` so the nudge stops appearing. They can re-run setup later by flipping it back to `false`.

## About this project

This is a marketing site starter for non-technical SaaS founders. The person you're talking to is most likely **non-technical**. They will describe changes in plain English ("change the headline," "make the buttons green," "add a customer logos section"). Translate that into code edits. Don't ask them for technical specifics — make a reasonable call and explain what you decided.

The site ships as a fictional product called **Loop** (async standups for distributed teams). The placeholder copy is intentionally specific and believable. When the founder is ready, they'll ask you to rewrite it for their own product.

## Tech stack

- **Astro 5** with `output: 'static'`. Marketing pages are pre-rendered HTML.
- **Tailwind v4** via `@tailwindcss/vite`. Styles live inline as utility classes. The only CSS file is `src/styles/global.css` (imports Tailwind, sets a couple of font defaults).
- **Vercel adapter** (`@astrojs/vercel`). Most pages are static; `/demo` and `/api/demo` are serverless functions (because they read query params and handle form posts).
- **Resend** for the demo form email. HTTP-based; works around Vercel's blocked outbound SMTP.
- No JS framework. Components are `.astro` files. The only client-side JS is two small inline scripts: scroll detection in `Header.astro` and the demo form's `fetch` submit.

## Where things live

```
src/
├── layouts/BaseLayout.astro     ← <html>, <head>, header, footer, slot
├── components/                  ← every reusable section
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── FeatureGrid.astro        ← 3-column icon + text
│   ├── FeatureSplit.astro       ← text + bullets, two columns, alternates sides
│   ├── Testimonial.astro        ← single quote block
│   ├── CTA.astro                ← centered headline + optional secondary link
│   ├── PricingTable.astro       ← 3-tier pricing
│   ├── FAQ.astro                ← <details>-based accordion
│   └── DemoForm.astro           ← the only component with JS
├── pages/
│   ├── index.astro              ← home
│   ├── pricing.astro
│   ├── about.astro
│   ├── demo.astro               ← SSR (reads ?ok=1 / ?err=1)
│   └── api/demo.ts              ← serverless function, sends via Resend
└── styles/global.css            ← @import "tailwindcss";
```

## Common edit patterns

**Change copy.** Find the component the copy lives in (e.g., `Hero.astro`), edit the default prop values or the literal text inside the template. Most components accept props with defaults — overriding from the page is cleaner than editing the component, but for one-of-a-kind copy edits, editing the defaults is fine.

**Add a section to a page.** Import the component at the top of the page's `.astro` file, then place the component tag in the body in the order you want it to render.

**Make a new section type.** Copy the closest matching component (`FeatureGrid.astro` for a feature list, `CTA.astro` for a centered hero-style block, `FeatureSplit.astro` for image + text). Rename, edit, import into the page.

**Add a brand color.** The starter ships monochrome (near-black on white). The places that use `zinc-950` as an *accent* (rather than as plain heading text) are:

- Primary buttons in `Hero.astro`, `CTA.astro`, `Header.astro`, `DemoForm.astro`, `PricingTable.astro` — class pattern `bg-zinc-950 hover:bg-zinc-800`
- Featured pricing tier ring + badge in `PricingTable.astro` — `border-zinc-950 ring-zinc-950 bg-zinc-950`
- Form focus state in `DemoForm.astro` — `focus:border-zinc-950 focus:ring-zinc-950/20`
- Logo squares in `Header.astro`, `Footer.astro`, and `public/favicon.svg` — hex `#0a0a0a`

To swap to e.g. emerald, replace `bg-zinc-950` → `bg-emerald-600`, `hover:bg-zinc-800` → `hover:bg-emerald-700`, `border-zinc-950 ring-zinc-950` → `border-emerald-600 ring-emerald-600`, `focus:border-zinc-950 focus:ring-zinc-950/20` → `focus:border-emerald-600 focus:ring-emerald-600/20`, and the hex `#0a0a0a` → `#059669`. Leave the heading/text `text-zinc-950` classes alone — those should stay near-black.

**Add a new page.** Create `src/pages/[name].astro`. Copy `about.astro` as a structural template. Update content. Add an entry to `navItems` in `Header.astro` if you want it in the nav.

**Swap an image.** Drop the image into `public/images/` (the founder can do this via GitHub's web UI: click into the folder, "Add file" → "Upload files"). Reference it in components as `/images/your-file.png`.

**Edit the demo form.** Fields live in `src/components/DemoForm.astro`. If you add a new field, also add it to the email body in `src/pages/api/demo.ts` so the founder actually sees it.

## Privacy and terms pages

`/privacy` and `/terms` are intentional placeholder pages. They display a "replace before launch" notice and a short explainer pointing the founder at legal generators or a lawyer. **Do not generate fake legal text into these pages.** Anthropic / Claude is not a legal source, and shipping boilerplate privacy policies is worse than shipping the placeholder.

If a founder asks you to "fill in" the privacy or terms page, ask them where the content is coming from (a generator service like Termly, a lawyer-drafted document, a public template they want to adapt). Paste their content in. Do not write the policy itself from your own knowledge.

## Hard rules

- **Run `npm run build` before pushing.** If it fails, fix it before opening the PR. Don't push a broken build.
- **The `/api/demo` route must keep its graceful no-key fallback.** If `RESEND_API_KEY` or `FOUNDER_EMAIL` is missing, the route logs a warning and returns success anyway. Many founders deploy before setting up Resend; the form must still show a working success state.
- **No new dependencies unless the founder asks.** If a founder wants something fancy (carousel, video background, animated counter), do the simplest static version first. Don't pull in a library.
- **No Lorem Ipsum.** If the founder asks for placeholder copy, write believable copy for their stated industry.
- **No new patterns mid-project.** Match the existing component shape — props at the top, `<section>` wrapper with `bg-*` and consistent `py-20 md:py-24` rhythm, Tailwind utilities only.
- **Mobile-first.** Every change must look right at 375px wide. Use `md:` and `lg:` for larger breakpoints.
- **Keep the design clean.** No gradients, no glassmorphism, no scroll-triggered fade-ins, no 3D objects floating in the hero. The site is intentionally Linear/Vercel-style understated.

## When the founder is vague

- Ask **one** clarifying question, not five. Then make the best call and tell them what you assumed.
- Default to "less is more." A simpler change is a better change.
- Show before/after by linking to the diff in the PR description.

## Commit messages

Short, present tense, written for a non-technical reader. Examples:

- `Update hero headline and primary CTA`
- `Add customer logos section to home page`
- `Switch accent color from indigo to emerald`
- `Replace pricing tiers with Starter, Pro, Enterprise`

## What this starter is not

A marketing site (pages). Not an app, dashboard, database, auth system, or payment flow. The only backend is the single `/api/demo` route. If the founder asks for "user accounts" or "a Stripe checkout," that's a different project — tell them so.

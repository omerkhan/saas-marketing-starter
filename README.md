# SaaS Marketing Site Starter

A marketing site for B2B SaaS founders, with home, pricing, about, and a working request-a-demo page (plus legal page placeholders). Built with Astro and Tailwind. Edited with Claude Code. Deployed on Vercel. Zero local setup required.

## Quickstart (5 minutes)

### 1. Deploy Your Copy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/omerkhan/saas-marketing-starter)

Click the button above. Vercel will ask you to sign in with GitHub (free), pick your new repo, and click **Deploy**. In about 60 seconds, your site is live at a `*.vercel.app` URL.

### 2. Edit with Claude Code on the web

1. Go to [claude.ai/code](https://claude.ai/code) (requires Claude Pro or Max).
2. Connect your GitHub account (one time).
3. Select your new repo.

**On your first session, Claude will greet you and ask 4 short questions** — your product name, what it does, who's on your team, and where demo form submissions should go. Answer them and Claude opens a PR renaming "Loop" to your product across the site. Merge the PR and Vercel redeploys with your branding.

After that, type what you want changed. Examples:
   - *"Change the hero headline to 'Customer support that doesn't suck.'"*
   - *"Replace the pricing tiers with $29 Starter, $99 Pro, and Custom Enterprise."*
   - *"Add a new section after the hero showing 4 customer logos."*
   - *"Change the accent color from black to emerald."*

Each request becomes a Pull Request on GitHub. Click **"Merge pull request"**. Vercel redeploys automatically.

That's it. Your site is now custom.

## Email setup (optional, 3 minutes)

The starter includes a working "Request a demo" page at `/demo`. To make submissions actually arrive in your inbox, do this. Skip if you don't need demo requests yet — the form works either way; without setup, submissions are silently ignored (the form still shows a success message so the visitor experience is unbroken).

1. Sign up at [resend.com](https://resend.com). Free, no credit card.
2. Copy your API key from the Resend dashboard.
3. In Vercel: Project → Settings → Environment Variables. Add two:
   - `RESEND_API_KEY` — paste the key from Resend
   - `FOUNDER_EMAIL` — the inbox you want demo requests sent to
4. Redeploy your site (Deployments → click the latest → Redeploy).

**Optional polish:** in Resend, verify your own sending domain so emails arrive from `forms@yourcompany.com` instead of Resend's shared address. Resend walks you through the DNS records. Add them in Vercel (or wherever your domain lives) and you're done. Then change the `from:` address in `src/pages/api/demo.ts` to match.

## Adding your domain

In Vercel, open your project → Settings → Domains → Add. Vercel walks you through DNS setup.

## Privacy & terms pages

The starter ships placeholder pages at `/privacy` and `/terms`. They contain no real legal text — just a notice explaining what needs to go there and how to get it.

Why placeholders instead of real policies: legal language has to be specific to your company, product, jurisdiction, and what data you collect. Generic boilerplate is often wrong for any specific product, and shipping the wrong policy is worse than shipping no policy.

Once your `/demo` form is real (it collects names and emails), you need a real privacy policy. Three ways to get one:

- **A generator service.** [Termly](https://termly.io), [Iubenda](https://iubenda.com), [GetTerms](https://getterms.io). Most cost $10–30/month and update your policy when laws change.
- **A startup lawyer.** Usually the right call once you are charging real customers.
- **A public template plus a legal review.** Slower, free, requires you to be careful.

When you have the real content, ask Claude Code to replace the contents of `src/pages/privacy.astro` and `src/pages/terms.astro` with your text.

## Adding images

Drag-and-drop images into the `public/images/` folder on GitHub (open the folder, click "Add file" → "Upload files"). Then ask Claude to use them.

## What if something breaks?

If you ask Claude for something and the site stops working, don't panic. The previous version is still live on Vercel. Open the failed deployment, see the error, paste it into Claude Code and ask it to fix.

## What this is not

This is a marketing site (pages). It is not an app, a dashboard, or a backend. It has no user accounts, database, or payment integration. For that, you need a different starter.

## Credits

Made by [SaaS Club](https://saasclub.io). Built on [Astro](https://astro.build), [Tailwind](https://tailwindcss.com), and [Vercel](https://vercel.com).

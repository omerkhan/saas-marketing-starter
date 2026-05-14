---
name: setup
description: Auto-runs on the first Claude session of a fresh saas-marketing-starter clone. Use IMMEDIATELY at the start of any session when the SessionStart hook reports `.claude/setup.json` shows `setup_complete: false` — that nudge means the starter has not been personalized yet and this skill must run before anything else. Also use when the founder asks "set me up", "help me get started", "personalize this site", "make this mine", "first-time setup", or any reference to running initial setup on the starter. Walks the founder through 4 short questions (product name, what it does, team, demo email), applies a coordinated set of edits to rename Loop to their product, and flips the setup marker.
---

# Setup

First-run personalization for the marketing site starter. Replaces the default "Loop" example with the founder's actual product across the right files. Runs once per starter clone.

## When to run

- Automatically: the SessionStart hook at `.claude/hooks/check-setup.sh` reads `.claude/setup.json`. If `setup_complete: false`, it surfaces a `[FIRST-TIME SETUP REQUIRED]` system reminder at the top of every session until setup completes.
- Manually: the founder asks to set up, personalize, or get started.

## Flow

### 1. Greet briefly

Say something short like:

> "Welcome — this looks like a fresh clone of the marketing site starter. Let me ask 4 short questions so I can customize the site for your product instead of the default 'Loop' example. You can skip any of them."

Don't be chatty. The founder is here to get this done.

### 2. Ask the questions one at a time

Ask, wait for the answer, acknowledge in a few words, then ask the next one. Do not present all four at once — that overwhelms a non-technical founder.

**Q1. What's your product called?** *(required)*

Capture verbatim. If they don't have a name yet, suggest staying with the default and re-running setup later (set `setup_complete: true` so the nudge stops; they can flip it back when ready).

**Q2. What does it do, in one sentence?** *(required)*

Capture verbatim. Drives hero subhead + meta description. Do not rewrite their words to sound more "marketing." They can sharpen the copy in a later turn.

**Q3. Who's on the team? (Just name and title for each.)** *(skip-able)*

Accept any format: comma-separated, line-separated, "just me." If skipped, leave the placeholder team in place and tell them they can ask you to edit the About page later.

**Q4. What email should `/demo` form submissions go to?** *(skip-able)*

This is not committed to code — the env var `FOUNDER_EMAIL` lives in Vercel. But if they give an email, offer to update the fallback `hello@loop.com` mentioned in the form's error message so it points at theirs.

### 3. Summarize and confirm

Before applying any edits, list the changes:

- "I'll rename 'Loop' to '{Product}' across the site (header, footer, page titles, og tags, etc.)."
- "I'll set the hero subhead and the meta description to: '{their description}'."
- "I'll replace the team in About with: {their team}." *(if provided)*
- "I'll update the form's fallback support email to {their email}." *(if provided)*
- "I'll mark setup as complete in `.claude/setup.json`."

Then ask: "Apply these changes?"

### 4. Apply the edits

Once confirmed, edit these files in order. Run `npm run build` at the end and fix any failures before proceeding.

**Product name → replace literal "Loop"**

- `src/layouts/BaseLayout.astro` — default `title` (replace `Loop — Standups...` with `{Product} — ...`) and default `description` (Q2)
- `src/components/Header.astro` — the `<span>Loop</span>` logo text
- `src/components/Footer.astro` — `© {year} Loop, Inc.` → `© {year} {Product}, Inc.`
- `src/components/Hero.astro` — default `subhead` literal mentions of Loop (replace with Q2)
- `src/components/CTA.astro` — default `subhead` "Try Loop free..."
- `src/components/Testimonial.astro` — default quote that says "switching to Loop"
- `src/pages/index.astro`, `pricing.astro`, `about.astro`, `demo.astro`, `privacy.astro`, `terms.astro` — page titles and any heading literals that say "Loop"
- `src/pages/api/demo.ts` — the `from:` display name (`Demo Requests <onboarding@resend.dev>` → `{Product} Demo Requests <...>`)
- `package.json` — `name` field (lowercase-kebab the product name, e.g. "acme" or "acme-marketing-site")

**Do not touch** these files even though they mention Loop:
- `README.md` (documents the starter, references to Loop are example content)
- `CLAUDE.md` (documents the starter)
- `.claude/skills/marketing-site-editor/SKILL.md` (documents the starter)
- This `SKILL.md` (documents the starter)
- `src/pages/privacy.astro` and `src/pages/terms.astro` (placeholders that intentionally say nothing about the product)

**Team (Q3, if provided):** replace the `team` array in `src/pages/about.astro`. For each person, compute `initials` from their name (first letter of each name part, max 2 chars, uppercase). If the founder said "just me" or only gave one name, that's fine — one team member is a valid array.

**Fallback support email (Q4, if provided):** replace `hello@loop.com` in `src/components/DemoForm.astro` and `src/pages/demo.astro` with their email.

### 5. Update the setup marker

Edit `.claude/setup.json`:

```json
{
  "setup_complete": true,
  "product": {
    "name": "{their answer to Q1}",
    "what_it_does": "{their answer to Q2}"
  },
  "team": [{ "name": "...", "title": "..." }],
  "founder_email": "{their answer to Q4 or empty}"
}
```

This flips the marker. The SessionStart hook stops nudging after this.

### 6. Verify

Run `npm run build`. If it fails, fix the failure before continuing — don't ship a broken build.

### 7. Commit + open a PR

Commit message: `Initial setup: customize starter for {Product}`

If the founder is working on `main`, commit and push directly. If on a branch (most Claude Code on web flows are), open a PR titled the same with a body summarizing what changed.

### 8. Wrap up

Tell them what to do next, briefly:

1. Merge the PR (or note that the commit is pushed). Vercel will redeploy automatically.
2. Set `RESEND_API_KEY` and `FOUNDER_EMAIL` in Vercel → Project → Settings → Environment Variables if they want the `/demo` form to actually send email. See README for the 3-step Resend setup.
3. Suggest 2 follow-up prompts they could try right now:
   - "Change the hero headline to something specific to {product}."
   - "Update the testimonial to a real one from a beta customer."

## Hard rules

- **Don't invent a hero headline.** The default "Standups without the meetings." is product-specific and will be wrong for most products. Leave it. The founder will see it and ask you to change it as a natural follow-up. Setup is for the obvious rename, not for marketing copywriting.
- **Don't rewrite the founder's product description.** Use their words verbatim, even if they sound rough. They can polish later. Rewriting their own product pitch will erode trust.
- **Don't fill in privacy or terms.** Those pages are intentional placeholders. The setup skill must not touch them.
- **Don't ask follow-up questions beyond the 4.** Setup is small on purpose. If the founder wants more done, they'll ask.
- **Don't proceed without explicit confirmation.** Always summarize and ask "Apply these changes?" before editing. The first impression of this tool is the founder watching it work — confirmation builds trust.
- **Don't add their email to committed code.** `FOUNDER_EMAIL` lives in Vercel env vars only. The "fallback support email" in the form's error message is the only email that goes in the codebase.

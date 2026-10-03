@AGENTS.md

## Claude Code workflow

Everything above applies. This file adds only how to work, not what the rules
are — do not restate `AGENTS.md`.

### Before editing

Read the route you are changing, its `layout`, and the shared components it
renders. Then state a short plan before touching anything. For a page, that
means knowing whether it is currently a Server or Client Component, where its
data comes from, and which shared components it pulls in.

### While editing

- Work in small, reviewable steps.
- Prefer editing an existing component over creating a near-duplicate. If a
  component almost fits, extend it.
- Verify Next 16 behaviour against `node_modules/next/dist/docs/` rather than
  memory. The installed version is 16.3.8 and several APIs changed.

### After every page create or edit

Run the Definition of Done from `AGENTS.md` and report back a short summary
covering:

- which checks you ran and what they returned
- measured numbers, not impressions — build output, lint counts, LCP/CLS/INP
- anything you could not verify, and why

### Screenshots

If Playwright or a browser tool is available, capture **390, 768 and 1440px**
and actually look at the images before declaring done. Playwright is not
installed today, so say that plainly instead of claiming visual verification.

### Never fake verification

If a check did not run, say it did not run. "Build passes" means you ran the
build and read the output. Do not infer a Lighthouse score, a contrast ratio or
a layout result you did not measure. An honest gap is useful; a fabricated
pass is not.

### Ask first

Stop and ask before:

- adding any dependency
- changing the caching strategy, including enabling `cacheComponents` or
  introducing `"use cache"`
- touching checkout or payment code — `/api/create-checkout-session`,
  `/api/stripe-webhook`, or anything computing totals
- renaming `middleware.js` to `proxy.js`
- committing or pushing (this is a hard rule in `AGENTS.md`)

# Soundarya's Boutique

An e-commerce storefront for sarees: Next.js 16 App Router, Supabase (Postgres),
NextAuth v4, Stripe Checkout, Cloudinary image hosting.

**This is a JavaScript project — there is no TypeScript.** No `tsconfig.json`, no
`.ts`/`.tsx` files, no `typecheck` script. Route files are `page.jsx`,
`loading.js`, `proxy.js`. Ignore any instruction that assumes `.tsx`.

## Versions

| Package | Version |
|---|---|
| next | 16.3.8 |
| react / react-dom | 19.3.0 |
| tailwindcss | 4.1.11 (CSS-first, no `tailwind.config.js`) |
| @supabase/supabase-js | 2.117.2 |
| next-auth | 4.24.15 — **never below 4.24.13**, earlier 4.x caps its `next` peer at `^15` and breaks every install |
| stripe | 18.5.0 |
| eslint | 9 + eslint-config-next 16 |

## Commands

npm is the package manager. These are the only scripts that exist:

```bash
npm run dev     # dev server (Turbopack is the default in Next 16)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint .  (`next lint` was removed in Next 16)
```

There is **no** `typecheck`, `test`, or `e2e` script. Do not invent them. See
*Recommended tooling* at the bottom for what is worth adding.

## Layout

- `src/app/` — App Router routes and API route handlers.
- `components/` — shared components. **Note the location:** repo root, *not*
  under `src/`. The `@/*` alias maps to `./src/*` only, so components are
  reached by relative path (`../../components/Navbar`).
- `src/app/lib/` — `supabase.js` (server client), `auth.js` (NextAuth options),
  `authUtils.js` (`isAdmin`, `ADMIN_ROLE`), `sarees.js`, `cart.js`, `orders.js`.
- `src/app/globals.css` — `@import "tailwindcss"` plus the `@theme inline`
  block. All design tokens live here.
- `supabase/schema.sql` — the whole database definition and the source of
  truth. Change it here, not only in the dashboard.
- `middleware.js` — route guards at the repo root.

## Data layer

| Concern | Source |
|---|---|
| Products | Supabase `sarees`. Server Components query directly; `src/app/lib/sarees.js` holds the card-level helpers; `/api/sarees` is admin CRUD. |
| Cart | Supabase `carts` + `cart_items`, behind `/api/cart`, `/api/cart/remove`, `/api/cart/update-quantity`. `src/app/context/CartContext.jsx` mirrors it client-side. |
| Orders | Supabase `orders` + `order_items`, written **only** by the Stripe webhook. |
| Checkout | Stripe Checkout via `/api/create-checkout-session`; fulfilment via `/api/stripe-webhook`. |
| Auth | NextAuth v4 credentials + bcrypt against Supabase `users`. |
| Images | Cloudinary (`res.cloudinary.com` is the only `remotePatterns` host). |

**Currency and locale are not centralised.** The only declaration is
`currency: "inr"` in `/api/create-checkout-session`. Everything else
hand-concatenates `₹`. See *Prices* below — this needs a shared helper.

## Next 16 specifics

Verified against the installed 16.3.8 and its bundled docs in
`node_modules/next/dist/docs/`. Check there rather than relying on memory.

- **Turbopack is the default** for `dev` and `build`; `--turbopack` is redundant.
- **`next lint` is removed** and `next build` no longer lints — run `npm run
  lint` yourself.
- **`params` and `searchParams` are Promises.** Always `await params`.
  Synchronous access is gone, not merely deprecated.
- **`headers()`, `cookies()` are async.** `await headers()` then `.get(...)`.
  Writing `await headers().get(...)` reads `.get` off a Promise and throws —
  this exact bug silently broke the Stripe webhook for a long time.
- **`middleware.js` is deprecated in favour of `proxy.js`.** We deliberately
  keep `middleware.js`: `proxy` forces the Node runtime and next-auth v4's
  `withAuth` targets the middleware convention. Do not rename it without
  re-testing the admin and cart guards.
- **Cache Components** (`cacheComponents: true` in `next.config.mjs` plus
  `"use cache"`, `cacheLife`, `cacheTag`) are available but **not enabled
  here**. Enabling them changes caching semantics app-wide — ask first.

## Design system & typography

Tokens live in the `@theme inline` block in `src/app/globals.css`. There is no
`tailwind.config.js` and one must not be added. Existing tokens: fonts
`--font-main` (Poppins) / `--font-secondary` (Yeseva One); colors `primary`
`#B71C1C`, `secondary` `#D4AF37`, `accent` `#004D40`, `royal` `#4A148C`,
`saffron` `#F4511E`, `ivory` `#FFFDD0`, `grey-dark` `#333333`, `grey-medium`
`#757575`, `grey-light` `#F9F7F2`; shadows `--shadow-premium`, `--shadow-gold`.
There is no type-scale or spacing token yet — add them here, not inline.

Rules:

- **Use Tailwind's default type steps:** 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 /
  48 / 60px (`text-xs` … `text-6xl`). Body text 16px minimum, secondary/meta
  14px, 12px only for legal text and badges.
- **No arbitrary values** (`text-[17px]`, `mt-[13px]`) unless a comment
  justifies it. The codebase currently violates this badly — see *Known issues*.
- Form inputs are **at least 16px on mobile**; smaller triggers iOS zoom on
  focus.
- Line height ~1.5 for body, 1.1–1.3 for headings. Long-form text 60–75ch
  (`max-w-prose`).
- Fluid headings use `clamp()` defined as a token, never inline per component.
- `globals.css` already styles `h1`–`h3` in a `@layer base` block. Extend that
  rather than restyling headings per page.
- **One `h1` per page; never skip heading levels.**
- Max two font families. Both load via `next/font` with `display: "swap"` in
  `src/app/layout.js` — keep it that way.

### Prices

- Format with a **shared `Intl.NumberFormat` helper**, never string
  concatenation and never a bare `.toLocaleString()`/`.toFixed()` call.
- Render prices with `tabular-nums` so digits do not jitter between states.
- Locale/currency is `en-IN` / `INR`, and must match the Stripe session
  currency.

## Spacing & layout

- 4px/8px grid only — Tailwind's default spacing scale.
- Page container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`. Several pages
  currently use `max-w-[1440px] mx-auto px-6 md:px-12`; prefer extracting a
  shared container component over adding a third variant.
- Section rhythm: ~48–64px mobile, ~64–80px tablet, ~80–96px desktop, applied
  through one shared Section component rather than per page.
- Product grids: 2 columns mobile, 3 tablet, 4 desktop; 5 only on very wide
  screens and only if the card still reads well. Keep gaps consistent.
- **Every product and media image needs a fixed aspect ratio** so the layout
  cannot shift.

## Responsiveness (mobile-first)

- Base styles target mobile; layer `sm:` `md:` `lg:` `xl:` `2xl:` upward.
- Use container queries (`@container`) for components that appear at different
  widths — a product card in a grid versus a carousel.
- Verify every page at **360, 390, 768, 1024, 1280, 1440, 1920px** plus
  landscape phone.
- **No horizontal page scroll at any width.** Wide content (tables,
  comparisons) scrolls inside its own container.
- Touch targets ≥44×44px with real spacing between them.
- **No hover-only interactions.** Menus, quick-add and tooltips must work by
  tap and by keyboard.
- Respect safe-area insets on the sticky header, bottom bars and the mobile
  add-to-cart bar.

## Accessibility (WCAG 2.2 AA)

- Contrast ≥4.5:1 for text, ≥3:1 for large text and UI boundaries.
- Visible focus states — never remove outlines without replacing them.
- Semantic HTML; every form field has a real label.
- Alt text on product images describing the product, not "image".
- Honour `prefers-reduced-motion`.
- Cart drawer, modals and menus are keyboard operable with focus trapped and
  restored, and close on Escape.
- Do not use `alert()`/`confirm()` for user-facing flow. `CartContext` still
  does; replace it when touching that code.

## Performance budgets

- Core Web Vitals, p75 mobile: **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.**
  Lighthouse mobile Performance ≥ 90.
- **Server Components by default.** `"use client"` belongs on genuinely
  interactive leaves — add-to-cart, variant picker, cart drawer. Never mark a
  whole page or layout as client. 20 of 31 pages currently break this.
- Images: always `next/image` with an accurate `sizes`. Identify the LCP
  hero/product image and give it `priority`; lazy-load everything below the
  fold. `objectFit` is a legacy prop — use `className="object-cover"`.
- Stream slow data with `<Suspense>` and `loading.js`. **Skeletons must match
  the final dimensions** or they trade a spinner for CLS.
- Caching, per data type: product catalog cached and revalidated; price and
  stock short-lived or fresh; cart and user data **never cached publicly**.
  Document the choice where you make it.
- No heavy third-party scripts in the critical path. Load analytics and chat
  via `next/script` with a deferred strategy.
- Check bundle impact before importing a large library for a small job.

## Data correctness

For any page that shows data, verify:

- Product name, price, compare-at price, currency, variants, stock and images
  all come from Supabase and agree with each other. **No placeholder or
  hardcoded product data ships.** `components/admin/SubscribersDashboard.jsx`
  and `src/app/admin/vendor/page.jsx` still render mock arrays.
- Every data-driven component handles **loading, empty** (no products, empty
  cart, no search results), **error** (API failure, with retry or fallback) and
  **out-of-stock**.
- Validate untrusted external data at the boundary. There is no Zod in the
  project today; if validation is warranted, propose adding it rather than
  hand-rolling checks.
- **Cart totals, discounts, tax and shipping are computed server-side or by
  Stripe — never trusted from the client.**

## SEO & metadata

- `generateMetadata` (or a static `metadata` export) on **every** route.
  Currently only `src/app/layout.js`, `src/app/collections/page.jsx` and
  `src/app/admin/layout.jsx` have one.
- Canonical URLs and Open Graph images.
- JSON-LD: `Product` on product pages, `BreadcrumbList` on collection and
  product pages, `Organization` once in the root layout. None exists yet.
- `sitemap.js`, `robots.js`, `not-found.jsx` and `error.jsx` — all absent.

## Querying Supabase

- Query through `supabase()` from `src/app/lib/supabase.js`. It holds the
  secret key (`sb_secret_…`), so it must never reach a Client Component —
  every caller is a route handler or a Server Component that already checked
  the session. The publishable key is unused: with RLS on and no policies it
  would read nothing.
- **Always check the returned `error`;** the client does not throw on its own.
- Columns are camelCase and quoted in the DDL, matching the JSON keys the
  components read. There is no snake_case mapping layer — do not add one.
- Prefer one embedded select over several round trips:
  `products:order_items(...)` and `items:cart_items(..., sarees(images))`
  replace Mongoose's `.populate()` and keep the keys components expect.
- Rows are already plain JSON (ISO dates, numbers) — pass them straight to
  Client Components, with no `JSON.parse(JSON.stringify(...))`.
- **Select explicit columns on `users`;** `select("*")` would hand the bcrypt
  hash to the client.
- The role is stored lowercase (`check (role in ('user', 'admin'))`). Server
  code compares it through `isAdmin()` or `ADMIN_ROLE` from
  `src/app/lib/authUtils.js`, never an inline string. Client Components cannot
  import that module — it pulls in `next-auth/next` — so they use the literal
  `"admin"`; keep the spelling exact.
- RLS is on with no policies. Any query from client code needs a policy written
  into `supabase/schema.sql` first.
- Do not construct SDK clients that validate credentials at module scope.
  `next build` evaluates modules while collecting page data, so a missing env
  var fails the build instead of the request.

## Environment

Secrets live in `.env.local` (gitignored). Required:
`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `NEXTAUTH_URL`,
`NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`, `TWILIO_ACCOUNT_SID`,
`TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.

On Vercel, `NEXT_PUBLIC_*` are plain config; everything else is Sensitive.
`SUPABASE_SECRET_KEY` must be available at **build** time too, because `/`
prerenders from `sarees`.

## Git workflow

**Never commit or push without asking the user first.** Stage and describe the
change, then wait for explicit approval. This applies to every
history-affecting command — `commit`, `push`, `force-push`, `rebase`, `reset
--hard`, `filter-branch`. Already-pushed commits must never be rewritten
without a direct instruction to do so.

Commit to `main` directly. Do not create a feature branch unless asked.

Never add `.env*`, `.idea/`, `.next/`, or `node_modules/` to a commit.

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

Types: `feat` (new feature), `fix` (bug fix), `chore` (deps, tooling, config),
`refactor` (no behaviour change), `perf`, `docs`, `style` (formatting only),
`test`, `build`, `ci`, `revert`.

Rules: imperative subject ("add cart drawer", not "added"); lowercase, no
trailing period, ≤72 chars; scope when it clarifies (`feat(cart):`); body
wrapped at 72 explaining *why*, not *what*; one logical change per commit;
breaking changes take `!` plus a `BREAKING CHANGE:` footer.

End every commit you author with this trailer, exactly as written, **with no
email address**:

```
Co-Authored-By: Claude Code
```

## Definition of Done

Run this for every page created or edited.

- [ ] `npm run lint` and `npm run build` pass with **zero new** warnings
      (there is no typecheck — see *Recommended tooling*)
- [ ] Layout verified at 360, 390, 768, 1024, 1280, 1440, 1920px and landscape
      phone; no overflow, overlap or awkward wrapping
- [ ] Typography and spacing use only design tokens
- [ ] Loading, empty, error and out-of-stock states implemented and checked
- [ ] Displayed data matches Supabase (price, stock, variants, currency format)
- [ ] LCP image identified and given `priority`; no CLS from images, fonts or
      skeletons
- [ ] Lighthouse mobile run recorded, with LCP / CLS / INP noted
- [ ] Route's client JS reviewed; no unnecessary `"use client"`
- [ ] Accessibility checked — keyboard, focus, contrast, labels (axe if present)
- [ ] Metadata and structured data present and valid

## Known issues

Measured, not guessed. Do not mass-fix these as a side effect of unrelated work.

| Issue | Detail |
|---|---|
| Arbitrary font sizes | 105 of them: `text-[10px]` ×70, `text-[9px]` ×22, `text-[8px]` ×4 — below any accessible minimum. 191 arbitrary spacing/sizing values overall |
| Client-heavy pages | 20 of 31 pages are whole-page Client Components, shipping their entire subtree |
| No streaming | Zero `loading.js`, zero `Suspense` — navigation freezes the old page 150–350ms with no feedback |
| Ad hoc prices | Formatted in ≥6 files with inconsistent options (`toLocaleString("en-IN", …)` vs `toFixed(2)`) |
| Raw images | 5 `<img>` tags bypass `next/image`; 3 `objectFit` props are the Next 12 legacy API |
| Dead endpoint | `CartContext.clearCart()` calls `/api/cart/clear`, which does not exist and never has — silent 404 |
| Hardcoded Cloudinary | `components/admin/ImageUpload.jsx` inlines the cloud name and upload preset instead of `CLOUDINARY_*` |
| Broken password reset | `forgot-password/route.js` reads `EMAIL_USER`/`EMAIL_PASS`, which nothing sets; the app uses `SMTP_*` |
| Unused route | `src/app/api/profile/route.js` has no callers |
| Unguarded path | `middleware.js` matches `/cart/:path*` but the directory is `src/app/Cart/` |
| Two lockfiles | `package-lock.json` and `yarn.lock` both committed; npm is the manager and keeps `yarn.lock` in sync |
| Lint baseline | 63 pre-existing problems (57 errors) from the React Compiler rules eslint-config-next 16 enables. They do not block the build |

## Recommended tooling

None installed. Propose before adding — see the dependency rule in `CLAUDE.md`.

| Gap | Why it matters |
|---|---|
| Playwright | No way to verify the required widths or take screenshots today |
| axe (`@axe-core/playwright`) | The accessibility checklist is entirely manual |
| Bundle analyzer | Needed to honour the "check bundle impact" rule |
| `typecheck` script | Only meaningful with TypeScript, or `checkJs` + JSDoc. Until then the Definition of Done has no type gate |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Soundarya's Boutique

An e-commerce storefront for sarees: Next.js App Router, Supabase (Postgres),
NextAuth v4, Stripe checkout, Cloudinary image hosting.

## Commands

```bash
npm run dev     # dev server (Turbopack is the default in Next 16)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint .  (`next lint` was removed in Next 16)
```

## Layout

- `src/app/` — App Router routes and API route handlers.
- `supabase/schema.sql` — the whole database definition. Apply it to a fresh
  project and keep it as the source of truth; change it here, not only in the
  dashboard.
- `components/` — shared components. **Note the location:** this is at the repo
  root, *not* under `src/`. The `@/*` alias maps to `./src/*` only, so components
  are reached by relative path (`../../components/Navbar`).
- `src/app/lib/` — `supabase.js` (server client), `auth.js` (NextAuth options),
  `authUtils.js` (`isAdmin`, `ADMIN_ROLE`), `sarees.js`, `cart.js` and
  `orders.js` (query helpers and shared select strings).
- `middleware.js` — route guards at the repo root.

## Conventions

- Query through `supabase()` from `src/app/lib/supabase.js`. It holds the
  secret key (`sb_secret_…`) and so must never be imported into a Client
  Component — every caller is a route handler or a Server Component that has
  already checked the session. The publishable key is not used anywhere: with
  RLS on and no policies it would read nothing.
- Always check the `error` the client returns; it does not throw on its own.
- Columns are camelCase and quoted in the DDL, matching the JSON keys the
  components read. There is no snake_case mapping layer — do not add one.
- Prefer one embedded select over several round trips: `products:order_items(...)`
  and `items:cart_items(..., sarees(images))` replace Mongoose's `.populate()`
  and keep the keys the components already expect.
- `params` in pages and route handlers is a Promise — always `await params`.
  Next 16 removed synchronous access.
- Rows are already plain JSON (ISO dates, numbers), so they can be passed to
  Client Components as they are — no `JSON.parse(JSON.stringify(...))` needed.
- Select explicit columns on `users`; `select("*")` would hand the bcrypt hash
  to the client.
- Do not construct third-party SDK clients at module scope when they validate
  credentials eagerly. `next build` evaluates modules during page-data
  collection, so a missing env var fails the build. Build such clients inside
  the handler.

## Environment

Secrets live in `.env.local` (gitignored). Required:
`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`, `TWILIO_ACCOUNT_SID`,
`TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.

## Git workflow

**Never commit or push without asking the user first.** Stage and describe the
change, then wait for explicit approval. This applies to every
history-affecting command — `commit`, `push`, `force-push`, `rebase`, `reset
--hard`, `filter-branch`. Already-pushed commits must never be rewritten
without a direct instruction to do so.

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

Rules:

- Subject in the imperative mood — "add cart drawer", not "added" or "adds".
- Lowercase subject, no trailing period, 72 characters or fewer.
- Scope is the affected area when it clarifies things: `feat(cart):`, `fix(api):`.
- Wrap the body at 72 columns. Explain *why*, not *what* — the diff shows what.
- One logical change per commit. Split unrelated work rather than bundling it.
- Breaking changes: add `!` after the type (`feat(api)!:`) and a
  `BREAKING CHANGE:` footer.

End every commit you author with this trailer, exactly as written, with no
email address:

```
Co-Authored-By: Claude Code
```

Example:

```
fix(api): await dynamic route params

Next.js 16 removes support for synchronously accessing `params` in route
handlers; it must be awaited.

Co-Authored-By: Claude Code
```

## Known gotchas

- The role is stored lowercase (`check (role in ('user', 'admin'))`). Server
  code compares it through `isAdmin()` or `ADMIN_ROLE` from
  `src/app/lib/authUtils.js`, never an inline string. Client Components cannot
  import that module — it pulls in `next-auth/next` — so they use the literal
  `"admin"`; keep the spelling exact. Several routes once tested for `"Admin"`,
  which no stored value can equal, and so rejected everyone.
- RLS is on with no policies, so the anon key can read nothing. Any query from
  client code needs a policy written in `supabase/schema.sql` first.
- The `middleware.js` matcher guards `/cart/:path*`, but the route directory is
  `src/app/Cart/`. The matcher does not match the capitalised path, so `/Cart`
  is unguarded.
- `components/admin/ImageUpload.jsx` hardcodes the Cloudinary cloud name and
  upload preset instead of reading the `CLOUDINARY_*` env vars.
- Both `package-lock.json` and `yarn.lock` are committed. npm is the package
  manager in use, and it keeps the stray `yarn.lock` in sync on install.
- next-auth must stay at 4.24.13 or newer: earlier 4.x releases cap their `next`
  peer at `^15` and make every `npm install` fail against Next 16.
- `src/app/api/auth/forgot-password/route.js` reads `EMAIL_USER`/`EMAIL_PASS`,
  which nothing sets — the rest of the app uses `SMTP_*`. Password-reset mail
  cannot send until those agree.
- `src/app/api/profile/route.js` has no callers. It is live and authenticated,
  but nothing in the UI fetches it.
- `middleware.js` is deprecated in Next 16 in favour of `proxy.js`, but `proxy`
  forces the Node runtime and next-auth v4's `withAuth` targets the middleware
  convention. Left as-is deliberately.
- `npm run lint` reports pre-existing React Compiler rule violations that
  eslint-config-next 16 newly enables. They do not block the build. Do not
  mass-fix them as a side effect of unrelated work.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

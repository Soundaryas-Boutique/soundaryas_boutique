# Soundarya's Boutique

An e-commerce storefront for sarees: Next.js App Router, MongoDB/Mongoose,
NextAuth v4, Stripe checkout, Cloudinary image hosting.

## Commands

```bash
npm run dev     # dev server (Turbopack is the default in Next 16)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint .  (`next lint` was removed in Next 16)
```

## Layout

- `src/app/` — App Router routes, API route handlers, and `(models)/` Mongoose schemas.
- `components/` — shared components. **Note the location:** this is at the repo
  root, *not* under `src/`. The `@/*` alias maps to `./src/*` only, so components
  are reached by relative path (`../../components/Navbar`).
- `src/app/lib/` — `mongoose.js` (cached connection), `auth.js` (NextAuth options),
  `authUtils.js` (`isAdmin`, `validateAdmin`), `sarees.js` (query helpers).
- `middleware.js` — route guards at the repo root.

## Conventions

- Call `await connectDB()` before any Mongoose query. The connection is cached
  on `global.mongoose`, so calling it per request is cheap and expected.
- `params` in pages and route handlers is a Promise — always `await params`.
  Next 16 removed synchronous access.
- Serialize Mongoose documents before passing them to Client Components
  (`.lean()` then convert `_id`/dates, as `src/app/lib/sarees.js` does).
- Do not construct third-party SDK clients at module scope when they validate
  credentials eagerly. `next build` evaluates modules during page-data
  collection, so a missing env var fails the build. Build such clients inside
  the handler.

## Environment

Secrets live in `.env.local` (gitignored). Required: `MONGODB_URI`,
`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`,
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

- **Admin role casing is inconsistent and currently broken in places.** The
  `User` schema enum is lowercase `["user", "admin"]`, and `authUtils.isAdmin`,
  `middleware.js` and `src/app/admin/layout.jsx` all compare against `"admin"`.
  But `src/app/api/sarees/[id]/route.js`, `src/app/api/Users/route.js`,
  `src/app/api/Users/[email]/route.js` and `components/admin/ProductForm.jsx`
  compare against `"Admin"`, which no stored role can equal — those admin-only
  checks reject every user. Prefer `isAdmin()` from `src/app/lib/authUtils.js`
  over inline comparisons.
- The `middleware.js` matcher guards `/cart/:path*`, but the route directory is
  `src/app/Cart/`. The matcher does not match the capitalised path, so `/Cart`
  is unguarded.
- `components/admin/ImageUpload.jsx` hardcodes the Cloudinary cloud name and
  upload preset instead of reading the `CLOUDINARY_*` env vars.
- Both `package-lock.json` and `yarn.lock` are committed. npm is the package
  manager in use, and it keeps the stray `yarn.lock` in sync on install.
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

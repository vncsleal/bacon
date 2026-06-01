# Migrating bacon — Make This Repo Yours

> **bacon is a starter, not an end product.** You forked it to build your own SaaS.
> This guide helps you rename, rebrand, replace content, configure services, and
> deploy — one checklist at a time.

---

## Phase 1: Rename

Replace `bacon` with your brand name across source code. This is a mechanical
search-and-replace — script it.

```bash
# Dry-run first — see every occurrence before changing anything
grep -rn --include="*.{ts,tsx,json,yml,yaml,md,mdx,css}" "bacon" . \
  --exclude-dir="node_modules" --exclude-dir=".git" --exclude-dir=".next" \
  --exclude-dir=".turbo" > bacon-references.txt

# Then replace (review the dry-run list first!)
# macOS: sed -i '' requires the empty-string backup extension
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \
  -o -name "*.yml" -o -name "*.yaml" -o -name "*.md" -o -name "*.mdx" \
  -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/.git/*" \
  ! -path "*/.next/*" ! -path "*/.turbo/*" \
  -exec sed -i '' 's/\bbacon\b/YOUR_BRAND/g' {} +
```

### Key files to update manually (check after sed)

| File | What to change |
|------|----------------|
| `package.json` | `"name": "bacon"` → `"name": "your-brand"`, `"bacon"` bin entry |
| `turbo.json` | Pipeline references if they contain "bacon" |
| `pnpm-workspace.yaml` | No changes needed (no "bacon" reference) |
| `packages/seo/metadata.ts` | `applicationName`, `author.name`, `author.url`, `publisher`, `twitterHandle` |
| `packages/rate-limit/index.ts` | `prefix: "bacon"` → Redis key namespace |
| `packages/security/middleware.ts` | Comment reference |
| `packages/database/drizzle/index.ts` | Log prefix in error message |
| `docker-compose.yml` | Header comment |
| `scripts/initialize.ts` | CLI intro text, clone URL |
| `scripts/update.ts` | CLI intro text |
| `scripts/utils.ts` | `url` constant, `tempDirName` |
| `scripts/index.ts` | CLI description |

### What NOT to rename

- **Internal npm packages** — `@repo/*` names are directory-based, not brand-based
- **Convex deployment names** — set via env vars, not code
- **`@repo/cms/adapters/local.tsx`** — this is fixture *content* (Phase 3). Don't
  rename the file, replace the text inside it.

---

## Phase 2: Rebrand

### Favicon and social images

Replace the image assets for each deployable app:

```bash
# App (authenticated dashboard) — favicon
# Replace: apps/app/app/icon.png

# App — social cards
# Replace: apps/app/app/opengraph-image.png
# Replace: apps/app/app/apple-icon.png

# Web (marketing site) — favicon (locale-level)
# Replace: apps/web/app/[locale]/icon.png

# Web — social cards (locale-level)
# Replace: apps/web/app/[locale]/opengraph-image.png
# Replace: apps/web/app/[locale]/apple-icon.png

# API — favicon
# Replace: apps/api/app/icon.png

# Docs (Mintlify)
# Replace: apps/docs/favicon.svg
# Replace: apps/docs/logo/dark.svg and apps/docs/logo/light.svg
```

### Metadata

Update title and description for each app. Exact file locations:

- **Dashboard** — Per-page metadata in sign-in, sign-up, verify-email, and search pages
  (`apps/app/app/(better-auth)/sign-in/page.tsx`, `sign-up/page.tsx`,
  `verify-email/page.tsx`, `apps/app/app/(authenticated)/search/page.tsx`)
- **Marketing site** — Update `web.home.meta` in each locale dictionary
  (`packages/internationalization/dictionaries/*.json`) — covered in Phase 3
- **Docs site** — `docs/app/layout.config.tsx` (title, GitHub URL)

### Colors

| File | What to change |
|------|----------------|
| `apps/docs/mint.json` | `colors.primary`, `colors.light`, `colors.dark`, `colors.anchors` |
| `packages/design-system/styles/globals.css` | CSS custom properties under `:root` and `.dark` |

### UI logo text

The header and footer hardcode "bacon" as text labels:

| File | Lines |
|------|-------|
| `apps/web/app/[locale]/components/header/index.tsx` | `grep -n "bacon"` the file |
| `apps/web/app/[locale]/components/footer.tsx` | `grep -n "bacon"` the file |

Replace the text (and optionally the Vercel SVG logo in the header).

---

## Phase 3: Replace Content

### Marketing site copy

The marketing site text lives in i18n dictionaries, not in components:

```bash
# Edit each locale's dictionary
packages/internationalization/dictionaries/en.json
packages/internationalization/dictionaries/pt.json
packages/internationalization/dictionaries/fr.json
packages/internationalization/dictionaries/de.json
packages/internationalization/dictionaries/es.json
packages/internationalization/dictionaries/zh.json
```

The `web.home` section contains hero, features, stats, testimonials, FAQ, and
CTA text. The components themselves (`apps/web/app/[locale]/(home)/components/`)
render from dictionary keys — you only need to change the JSON values.

### Blog posts and legal pages

Fixture content lives in the CMS adapter:

| File | Content |
|------|---------|
| `packages/cms/adapters/local.tsx` | Blog post fixtures and legal page text |

Replace the `FIXTURE_POSTS` array with your own content. Each post has
`_slug`, `_title`, `authors`, `categories`, `date`, `description`, `image`,
and `body` fields.

### Email templates

| File | Purpose |
|------|---------|
| `packages/email/templates/verify-email.tsx` | Email verification |
| `packages/email/templates/contact.tsx` | Contact form notification |

Both contain branding references — update the copy and any logo references.

### Documentation site

The `apps/docs/` directory is a Mintlify site. Its `.mdx` files and `mint.json`
contain boilerplate content and Mintlify defaults. Replace these with your own
documentation:

```bash
apps/docs/introduction.mdx
apps/docs/quickstart.mdx
apps/docs/development.mdx
apps/docs/deployment.mdx
apps/docs/essentials/*.mdx
apps/docs/api-reference/*.mdx
```

### Project docs site

The `docs/` directory (Next.js/Fuma) hosts ADRs and project documentation. It has
"bacon" references in OG images, layout, landing page, and all content files:

```bash
# App files (structure, layout, OG images):
docs/app/layout.config.tsx        # Title, GitHub URL
docs/app/[[...slug]]/page.tsx     # GitHub URL, og title
docs/app/og/[...slug]/route.tsx   # OG image text
docs/components/vercel.tsx        # Demo title, project name, URLs

# Landing page components:
docs/app/[[...slug]]/(home)/components/footer.tsx
docs/app/[[...slug]]/(home)/components/installer.tsx
docs/app/[[...slug]]/(home)/components/open-source.tsx
docs/app/[[...slug]]/(home)/components/social.tsx

# Documentation content (90+ files — all reference "bacon"):
docs/content/docs/docs/             # Philosophy, structure, FAQ
docs/content/docs/docs/setup/       # Installation, prerequisites, env
docs/content/docs/packages/         # All package docs
docs/content/docs/apps/             # App-specific docs
docs/content/docs/migrations/       # Migration guides
docs/content/docs/addons/           # Third-party addon docs
```

The content under `docs/content/docs/` is the original next-forge documentation
rebranded to "bacon" — replace it with your own project documentation.

---

## Phase 4: Configure Services

```bash
cp .env.example .env.local
```

Then fill in every value. See the **Environment Variables** section in
[README.md](./README.md) for where to obtain each key.

Quick-reference for required credentials:

| Service | Get credentials from |
|---------|---------------------|
| Convex | [convex.dev](https://convex.dev) — create a deployment |
| Better Auth | `openssl rand -base64 32` |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) |
| Resend | [resend.com](https://resend.com) |
| Arcjet | [arcjet.com](https://arcjet.com) |
| Upstash Redis | [upstash.com](https://upstash.com) |
| Liveblocks | [liveblocks.io](https://liveblocks.io) |
| Knock | [knock.app](https://knock.app) |
| BaseHub (CMS) | [basehub.com](https://basehub.com) |
| PostHog | [posthog.com](https://posthog.com) |
| Svix | [svix.com](https://svix.com) |
| Better Stack | [betterstack.com](https://betterstack.com) |

For CI/CD and Docker deployment, see the [deployment guide](apps/docs/deployment.mdx).

---

## Phase 5: Deploy

Three deployable applications:

| App | Port | Purpose | Deploy to |
|-----|------|---------|-----------|
| `apps/app` | 3000 | Authenticated dashboard | Vercel |
| `apps/web` | 3001 | Marketing site | Vercel |
| `apps/api` | 3002 | Webhooks, cron, health | Docker / Vercel |

All three share one Convex deployment. See `apps/docs/deployment.mdx` for
detailed instructions on Vercel and Docker setup.

### Custom domains

Each deployable app needs its own domain in production.
Set them up in the Vercel dashboard (Project → Settings → Domains):

| App | Example domain |
|-----|----------------|
| **Dashboard** (`apps/app`) | `app.yourdomain.com` |
| **Marketing site** (`apps/web`) | `yourdomain.com` |
| **API server** (`apps/api`) | `api.yourdomain.com` |

Vercel provides CNAME targets for each domain — add them to your DNS
provider (e.g., `app.yourdomain.com CNAME cname.vercel-dns.com`).
If deploying `apps/api` on Docker, use an A record pointing to your
server IP instead.

The **docs site** (`apps/docs`) is a Mintlify site — configure its
domain in the [Mintlify dashboard](https://mintlify.com), not in Vercel.

After domains are set, update your environment variables for production:

| Variable | Example |
|----------|---------|
| `SITE_URL` | `https://app.yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | `https://app.yourdomain.com` |
| `NEXT_PUBLIC_WEB_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_DOCS_URL` | `https://docs.yourdomain.com` |

Convex URLs (`NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`)
stay as provided by your Convex deployment — no custom domain needed.

See [Vercel's custom domain docs](https://vercel.com/docs/projects/domains/add-a-domain)
for DNS setup details per provider.

---

## Final checklist

- [ ] **Phase 1** — `bacon` replaced with your brand name in source
  (`grep -rn "bacon" . --exclude-dir="node_modules" --exclude-dir=".git" --exclude-dir=".next" --exclude-dir=".turbo"` returns zero matches)
- [ ] **Phase 2** — Favicon, OG images, apple-icon replaced in all 3 apps
- [ ] **Phase 2** — Design system colors updated (globals.css, mint.json)
- [ ] **Phase 2** — Metadata (title, description, author) updated per app
- [ ] **Phase 2** — Header/footer logo text replaced
- [ ] **Phase 3** — Marketing copy replaced in all 6 locale dictionaries
- [ ] **Phase 3** — Blog post fixtures replaced in CMS adapter
- [ ] **Phase 3** — Email templates branded to your company
- [ ] **Phase 3** — Doc sites (Mintlify + Fuma) updated
- [ ] **Phase 4** — `.env.local` created with all service credentials
- [ ] **Phase 5** — Custom domains configured in Vercel + DNS
- [ ] **Phase 5** — URL env vars updated to production domains
- [ ] **Phase 5** — Deployed to Vercel / your infrastructure

---

## Related docs

- [README.md](./README.md) — Quick start, architecture overview, env var guide
- [UPGRADING.md](./UPGRADING.md) — Keeping your fork in sync with upstream
- [docs/adrs/](./docs/adrs/) — Architecture Decision Records
- [apps/docs/deployment.mdx](./apps/docs/deployment.mdx) — Docker + Vercel deploy

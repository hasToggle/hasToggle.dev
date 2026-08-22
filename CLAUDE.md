# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **has-toggle** monorepo - a production-grade Turborepo template for Next.js SaaS applications. The codebase is built around five core principles: Fast, Cheap, Opinionated, Modern, and Safe. It uses Bun workspaces and Turborepo for managing multiple applications and shared packages.

## Development Commands

### Setup & Installation
```bash
bun install                    # Install all dependencies
```

Set `MONGODB_URI` in the environment (validated via @t3-oss/env-nextjs in `packages/database/keys.ts`).

### Running Applications
```bash
bun dev                       # Run all apps in development mode
turbo dev --filter=app         # Run only the main app (port 3000)
turbo dev --filter=web         # Run only the web/marketing site (port 3001)
turbo dev --filter=api         # Run only the API (port 3002, includes Stripe webhook listener)
```

### Testing
```bash
bun test                      # Run tests across all workspaces
turbo test --filter=app        # Run tests for specific app
bun test                       # Run Bun test runner in apps/app or apps/api
```

### Code Quality
```bash
bun run check                     # Run Biome linter/formatter checks (uses ultracite presets)
bun run fix                       # Auto-fix linting/formatting issues
turbo boundaries               # Check package boundaries
```

### Building
```bash
bun run build                     # Build all apps (depends on tests passing)
turbo build --filter=app       # Build specific app
turbo analyze --filter=app     # Analyze bundle size
```

### Database

The database is MongoDB, accessed through the official `mongodb` driver — there is no ORM, no schema migrations, and no generated client. `packages/database/index.ts` exports a `database` object with typed collection handles; document types live in `packages/database/types.ts`.

### Maintenance
```bash
bun run bump-deps                 # Update dependencies (excludes recharts)
bun run bump-ui                   # Update shadcn/ui components
bun run clean                     # Clean node_modules from root
turbo clean                    # Clean build artifacts and node_modules from all workspaces
```

## Architecture

### Monorepo Structure

The repository uses **Bun workspaces** with two main directories:

- **apps/** - Deployable applications (independently deployable)
- **packages/** - Shared packages consumed by apps

### Applications (apps/)

1. **app** (port 3000) - Main SaaS application
   - Authentication via better-auth (route groups: `(authenticated)` and `(unauthenticated)`); handler mounted at `/api/auth/[...all]`
   - Uses Next.js 16 with App Router
   - Server actions in `app/actions/`
   - API routes in `app/api/`
   - Tests configured with Bun test runner

2. **web** (port 3001) - Marketing/landing page
   - Internationalization support (uses `[locale]` route)
   - Content management via CMS package
   - Rate limiting via Arcjet

3. **api** (port 3002) - RESTful API server
   - Health check endpoint at `/health`
   - Webhook handlers in `app/webhooks/`
   - Cron jobs in `app/cron/`
   - Development includes Stripe webhook listener (requires Stripe CLI)

4. **email** - Email templates (React Email)
5. **storybook** (`apps/storybook`) - Component development environment.
   Its package name is `@repo/storybook`, **not** `storybook`: Bun links every
   workspace package into the root `node_modules` by name, so a workspace named
   `storybook` shadows the real `storybook` npm package and every addon that
   imports `storybook/internal/*` fails to resolve. Turbo filter is
   `--filter=@repo/storybook`. Never name a workspace after one of its own
   dependencies.
6. **studio** - Database management UI (stale Prisma Studio wrapper; non-functional since the MongoDB migration)

### Shared Packages (packages/)

Core infrastructure packages:

- **@repo/auth** - better-auth authentication (client, server, middleware, provider)
  - MongoDB adapter + organization plugin; the active org id is the tenant id
  - Server instance in `instance.ts`; `server.ts` is a Clerk-shaped compat layer
    (`auth()`, `currentUser()`) so callers did not have to change
  - Handler mounted by apps/app at `/api/auth/[...all]`
- **@repo/database** - MongoDB via the official `mongodb` driver (server-only)
  - Typed collection handles exported from `packages/database/index.ts`
  - Document types at `packages/database/types.ts`
  - Requires `MONGODB_URI` (validated in `packages/database/keys.ts`)
- **@repo/design-system** - shadcn/ui component library
  - Components in `components/` (auto-generated, excluded from Biome linting)
  - Providers for themes, tooltips, etc.
  - Dark mode support via next-themes
- **@repo/observability** - Sentry error tracking and logging
- **@repo/security** - Arcjet integration for application security
- **@repo/analytics** - Google Analytics and PostHog
- **@repo/payments** - Stripe integration
- **@repo/email** - Resend email service
- **@repo/webhooks** - Webhook handling (inbound/outbound)
- **@repo/collaboration** - Real-time features (Liveblocks)
- **@repo/feature-flags** - Feature flag management
- **@repo/notifications** - In-app notifications
- **@repo/internationalization** - i18n support
- **@repo/cms** - Content management (BaseHub)
- **@repo/seo** - SEO utilities
- **@repo/storage** - File upload/management
- **@repo/ai** - AI integration utilities

### Technology Stack

- **Framework**: Next.js 16 with App Router, React 19
- **Language**: TypeScript 5.9 (strict mode, NodeNext module resolution)
- **Package Manager**: Bun 1.1.43
- **Build Tool**: Turborepo 2.5.8
- **Database**: MongoDB via the official `mongodb` driver 7.x
- **Auth**: better-auth (email/password + organizations)
- **Styling**: Tailwind CSS 4.1
- **Linting**: Biome 2.3.1 with ultracite presets (core, react, next)
- **Testing**: Bun test runner
- **Bundling**: tsup for package builds

### Important Patterns

1. **Workspace Dependencies**: Internal packages use `workspace:*` protocol
   - Example: `"@repo/auth": "workspace:*"`

2. **Route Groups**: Apps use Next.js route groups for layout separation
   - app: `(authenticated)` and `(unauthenticated)` groups
   - web: `[locale]` for internationalization

3. **Server/Client Separation**: Packages use `server-only` for server-side code
   - Database and auth server utilities are server-only
   - Client components/utilities are separate files

4. **Environment Variables**: Uses @t3-oss/env-nextjs for type-safe env validation

5. **Path Aliases**: Apps configure aliases via tsconfig.json paths
   - `@/` - points to app root
   - `@repo/` - points to packages directory

6. **Biome Exclusions**: Auto-generated code excluded from linting:
   - `packages/design-system/components/ui` (shadcn components)
   - `packages/collaboration/config.ts` (Liveblocks config)
   - `packages/cms/basehub-types.d.ts` (CMS types)

7. **Build Dependencies**: `turbo.json` configures build to depend on tests passing
   - Builds run `^build` (dependency builds) then `test` before building

## Key Files

- `turbo.json` - Turborepo task pipeline configuration
- `biome.jsonc` - Linter/formatter configuration (extends ultracite presets)
- `packages/database/types.ts` - Database document types
- `docs/voice.md` - The writing voice for anything a visitor reads
- `docs/design.md` - The instrument design grammar for the playground demos
- Root `package.json` - Monorepo scripts, workspace configuration, and CLI entry point (`dist/index.js`)

## Writing copy

Any user-facing prose in `apps/web` or `packages/email` — exhibit titles, demo
prose, asides, panel labels, FAQ answers, digest copy — follows `docs/voice.md`.
Read it before drafting, and edit against its three passes (§5) before calling
copy done. It is short on purpose; do not skim it.

Do not add rules to it casually. A rejected line that an existing rule already
predicted means the guide worked and needs no edit — see §9.

## Designing demos

Demo UI follows `docs/design.md` — the fixed instrument grammar (state gauge,
view controls, specimen, deck, reference bar), the feedback rules, and the
current migration state. Read it before building or reshaping an exhibit.
Copy and demo co-evolve: when a panel gains a capability, re-run voice.md's
three passes over the exhibit's prose, because the instrument may have
obsoleted lines that were accurate when they shipped.

Design rounds in this repo run on proposals: present options with a clear
recommendation and the trade-offs named, get an explicit yes, then build.
Project knowledge belongs in the repo — these docs, not external notes.

## Development Notes

- The main branch is not explicitly configured in git - PRs should target the default branch
- Apps have independent dev ports: app (3000), web (3001), api (3002)
- API development automatically runs Stripe CLI webhook forwarding to localhost:3002/webhooks/payments
- MongoDB access goes through the shared client in `packages/database/index.ts` (cached on `global` in development to survive hot reloads)
- Tests must pass before builds complete (enforced by Turborepo pipeline)
- The design system excludes shadcn auto-generated UI components from version control linting

<!-- NEXT-AGENTS-MD-START -->
[Next.js Docs]
STOP. What you remember about Next.js is WRONG for this project. Read the docs before any Next.js task.
The full, version-matched docs ship inside the installed package: `apps/web/node_modules/next/dist/docs/` — markdown mirroring nextjs.org/docs (`01-app/01-getting-started/`, `01-app/02-guides/`, `01-app/03-api-reference/`, `02-pages/`, `03-architecture/`). Search there with grep/glob; there is no `.next-docs` directory in this repo. The `nextjs_docs` MCP tool (next-devtools) returns this same path.
<!-- NEXT-AGENTS-MD-END -->

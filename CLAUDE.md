# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **next-forge** monorepo - a production-grade Turborepo template for Next.js SaaS applications. The codebase is built around five core principles: Fast, Cheap, Opinionated, Modern, and Safe. It uses pnpm workspaces and Turborepo for managing multiple applications and shared packages.

## Development Commands

### Setup & Installation
```bash
pnpm install                    # Install all dependencies
pnpm migrate                   # Format, generate, and push Prisma schema to database
```

### Running Applications
```bash
pnpm dev                       # Run all apps in development mode
turbo dev --filter=app         # Run only the main app (port 3000)
turbo dev --filter=web         # Run only the web/marketing site (port 3001)
turbo dev --filter=api         # Run only the API (port 3002, includes Stripe webhook listener)
```

### Testing
```bash
pnpm test                      # Run tests across all workspaces
turbo test --filter=app        # Run tests for specific app
NODE_ENV=test vitest run       # Run vitest in apps/app or apps/api
```

### Code Quality
```bash
pnpm check                     # Run Biome linter/formatter checks (uses ultracite presets)
pnpm fix                       # Auto-fix linting/formatting issues
turbo boundaries               # Check package boundaries
```

### Building
```bash
pnpm build                     # Build all apps (depends on tests passing)
turbo build --filter=app       # Build specific app
turbo analyze --filter=app     # Analyze bundle size
```

### Database
```bash
pnpm migrate                   # Format schema, generate Prisma client, push to DB
cd packages/database && npx prisma studio    # Open Prisma Studio
cd packages/database && npx prisma generate  # Regenerate Prisma client only
```

### Maintenance
```bash
pnpm bump-deps                 # Update dependencies (excludes recharts)
pnpm bump-ui                   # Update shadcn/ui components
pnpm clean                     # Clean node_modules from root
turbo clean                    # Clean build artifacts and node_modules from all workspaces
```

## Architecture

### Monorepo Structure

The repository uses **pnpm workspaces** with two main directories:

- **apps/** - Deployable applications (independently deployable)
- **packages/** - Shared packages consumed by apps

### Applications (apps/)

1. **app** (port 3000) - Main SaaS application
   - Authentication via Clerk (route groups: `(authenticated)` and `(unauthenticated)`)
   - Uses Next.js 16 with App Router
   - Server actions in `app/actions/`
   - API routes in `app/api/`
   - Tests configured with Vitest + React Testing Library

2. **web** (port 3001) - Marketing/landing page
   - Internationalization support (uses `[locale]` route)
   - Content management via CMS package
   - Rate limiting via Arcjet

3. **api** (port 3002) - RESTful API server
   - Health check endpoint at `/health`
   - Webhook handlers in `app/webhooks/`
   - Cron jobs in `app/cron/`
   - Development includes Stripe webhook listener (requires Stripe CLI)

4. **docs** - Documentation site (Mintlify)
5. **email** - Email templates (React Email)
6. **storybook** - Component development environment
7. **studio** - Database management UI

### Shared Packages (packages/)

Core infrastructure packages:

- **@repo/auth** - Clerk authentication (client, server, middleware, provider)
- **@repo/database** - Prisma ORM with Neon PostgreSQL adapter
  - Schema at `packages/database/prisma/schema.prisma`
  - Generated client at `packages/database/generated/client/`
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
- **Package Manager**: pnpm 10.19.0
- **Build Tool**: Turborepo 2.5.8
- **Database**: PostgreSQL (Neon) via Prisma 6.18
- **Auth**: Clerk
- **Styling**: Tailwind CSS 4.1
- **Linting**: Biome 2.3.1 with ultracite presets (core, react, next)
- **Testing**: Vitest 4.0 + React Testing Library
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

5. **Path Aliases**: Apps configure aliases in vitest.config.mts
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
- `pnpm-workspace.yaml` - Workspace configuration
- `biome.jsonc` - Linter/formatter configuration (extends ultracite presets)
- `packages/database/prisma/schema.prisma` - Database schema
- Root `package.json` - Monorepo scripts and CLI entry point (`dist/index.js`)

## Development Notes

- The main branch is not explicitly configured in git - PRs should target the default branch
- Apps have independent dev ports: app (3000), web (3001), api (3002)
- API development automatically runs Stripe CLI webhook forwarding to localhost:3002/webhooks/payments
- Prisma client is generated to a custom output directory: `packages/database/generated/client/`
- Tests must pass before builds complete (enforced by Turborepo pipeline)
- The design system excludes shadcn auto-generated UI components from version control linting

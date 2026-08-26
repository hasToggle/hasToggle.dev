# hasToggle.dev

**The unofficial live playground for Next.js and Vercel.**

Every chapter opens on something developers say — *“I’ll put `use client` on it,
to be safe”*, *“It’s either cached or it isn’t”* — and runs the real feature next
to it. Not a screenshot of the feature, not a sandbox running a copy: the page
you are reading is the thing being demonstrated. Press the button, watch the
cache expire, open the drawer and read the code that did it.

The site is live at [hasToggle.dev](https://hastoggle.dev). This repo is the
whole of it, and [a second repo](https://github.com/hasToggle/hasToggle.dev-checkpoints)
publishes every prompt and checkpoint that produced it.

Not affiliated with Vercel. Nobody on the Next.js team sees a chapter before it
ships, which is where both the mistakes and the freedom come from.

---

## What’s here

The playground has a book shape. `/lab` is the contents page; each chapter owns
a route segment at `/lab/<slug>`, so topics that are *made of* routes — parallel
routes, `not-found`, dynamic params, view transitions — can exist at all. A new
chapter lands every Monday, and the write-up goes out to the digest list the
same day.

| Chapter | Topic | Route |
|---|---|---|
| I’ll put “use client” on it, to be safe. | server & client components | [`/lab/boundary`](https://hastoggle.dev/lab/boundary) |
| I don’t need state for a simple counter. | useState & re-renders | [`/lab/state`](https://hastoggle.dev/lab/state) |
| It’s either cached or it isn’t. | caching & revalidation | [`/lab/caching`](https://hastoggle.dev/lab/caching) |
| I’ll fetch it all first, then render. | streaming & suspense | [`/lab/streaming`](https://hastoggle.dev/lab/streaming) |
| You need an API route for that. | server actions & cookies | [`/lab/server-actions`](https://hastoggle.dev/lab/server-actions) |
| I’ll need to design a card for every page. | ImageResponse & route handlers | [`/lab/og-images`](https://hastoggle.dev/lab/og-images) |

That table is a snapshot. `apps/web/app/[locale]/lab/syllabus.ts` is the source
of truth — read it there for what has shipped, what lands next Monday, and the
twenty-odd topics still queued.

The playground is free, permanently. The paid thing is coaching: small cohorts
building production apps on exactly these topics. The site doesn’t get better if
you buy the cohort; it’s the same page either way.

## Where the interesting code is

Most of this repo is infrastructure inherited from a template. The part that is
actually hasToggle is `apps/web`:

```
apps/web/app/[locale]/
├── (playground)/          one folder per chapter — the instruments
│   ├── boundary/          server vs client, rendered side by side
│   ├── shell/             the page re-baking itself (chapter: caching)
│   ├── stream/            three rows resolving in delay order
│   ├── mutation/          a form wired to a Server Action, no API route
│   ├── image/             /api/og drawing a card from a title
│   ├── state/             useState, replayed in slow motion
│   ├── navigation/        next up — the reading only, for now
│   └── demo-section.tsx   the editorial wrapper every chapter wears
├── lab/
│   ├── syllabus.ts        the registry that drives everything
│   ├── chapter.tsx        the shared chapter frame
│   └── <slug>/page.tsx    one page per chapter
└── components/            hero, contents bar, digest, FAQ, footer
```

Two things worth knowing before reading any of it:

**One registry, one source of truth.** `syllabus.ts` drives the contents rows,
the landing roadmap, the contents bar, the page-turn links, the sitemap, the OG
titles and the `/latest` redirect. Shipping a chapter is one entry flip —
`planned` → `next` → `shipped`, belief and nav label added — and nothing else to
keep in sync.

**Each chapter folder is self-contained.** `demo.tsx` (the instrument),
`source.ts` (the code the reference drawer shows), `index-value.tsx` (one true
reading from the running instrument, displayed on the contents row), and
whatever server actions and pure functions the chapter needs, with their tests
beside them.

## Running it

```sh
bun install
turbo dev --filter=web        # http://localhost:3001
```

`apps/web/env.ts` validates the environment through `@t3-oss/env-nextjs`. The
ones without which nothing starts: `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_APP_URL`,
`MONGODB_URI`, and the three `RESEND_*` keys the digest signup needs.

The gates, run from inside the workspace — not the repo root, which sweeps up
every workspace’s tests without their per-workspace preloads and fails on files
you never touched:

```sh
cd apps/web
bun test
bun run typecheck             # bun test does not typecheck; the build gate does
```

**`next dev` lies about cache semantics.** A `use cache` entry written during a
Server Action survives a reload locally and does not on Vercel, because dev pairs
the real cache handler with a built-in front one. Anything touching `use cache`,
`updateTag` or revalidation has to be verified on a preview deploy; a clean dev
run proves nothing.

The other apps (`app`, `api`, `email`, `storybook`) come from the template and
are not part of the site. `apps/studio` is a stale Prisma Studio wrapper, dead
since the MongoDB migration.

## How it’s built

In public, with AI. The work happens in Conductor orchestrating Claude Code, and
Entire.io publishes the process — prompts, checkpoints, wrong turns included — to
the checkpoints repo, with every chapter page linking the commits behind it. The
AI writes the code. Someone still has to decide what ships, and that part hasn’t
been automated.

Three documents govern the work, and they are worth reading before changing
anything a visitor sees:

- **`CLAUDE.md`** — repo conventions, commands, architecture. What an agent
  reads first.
- **`docs/voice.md`** — the writing voice for anything a visitor reads. Four
  registers, one stance, and an append-only record of lines that were rejected
  and why. It is short on purpose.
- **`docs/design.md`** — the instrument grammar every demo sits in: the state
  gauge, the view controls, the specimen, the deck, the reference bar. Plus the
  feedback rules and the verification traps.

Both docs update on a novel rejection, never on a schedule. A line that gets cut
because an existing rule predicted it means the guide worked and needs no edit.

CI is the Vercel deploy of `apps/web` plus Claude review actions; there is no
GitHub Actions test run. `turbo build` depends on `test` and `typecheck`, so the
deploy is the gate.

## Where this is going

### 1. The full range

The syllabus is everything Next.js can do, plus as much of Vercel as can be
proved from inside a web page. Six chapters are running; the rest still wear a
`+` — routing in all its forms, the asset pipeline, metadata and SEO, optimistic
UI, ISR, the edge network, feature flags, cron, storage, instant rollback. The
milestone is the Monday the `+` rows run out.

One chapter a week, in whatever order the work happens. There is no chapter
numbering anywhere on the site, because a number would only ever have recorded
which week the work got done.

### 2. The shop

A production application that is meta about its own implementation: a real (if
fictional) ecommerce site carrying a table of contents per page and per section,
listing every mechanism that page is made of. Click any piece of content and the
site shows you what’s underneath it — which cache holds it, which boundary it
crossed, which route rendered it, which request it waited on.

The reason this is a separate milestone rather than more chapters: **a production
site is where features interact, and interaction is the one thing an isolated
demo cannot show.** A chapter can prove that a `use cache` entry refills when its
tag is deleted. It cannot show you what that looks like behind an intercepted
route, under a Server Action that also writes a cookie, on a page whose OG image
is generated from the same data that the cart is reading. The shop is where the
chapters meet each other, and where the answer to "how do I actually assemble
this" stops being left as an exercise.

Open questions, all of them real design work: what the surface is called and
where it lives; whether the inspector overlay can be built without breaking the
fixed instrument grammar the lab runs on; and whether a page’s mechanism list is
authored or derived from the modules the page actually renders. The lab’s whole
discipline is that one registry drives every list, and a hand-maintained
mechanism list would be the first thing on this site that could silently go
stale.

## Inherited from next-forge

The monorepo is a fork of [next-forge](https://github.com/vercel/next-forge), and
its bones are still load-bearing: the Turborepo layout, the `packages/*` split,
Biome via ultracite, the design system. What has diverged: the database is
MongoDB through the official driver with no ORM and no migrations, auth is
better-auth, and `apps/web` has been replaced entirely.

Bun workspaces, Turborepo, Next.js 16 with Cache Components, React 19,
TypeScript 7 (native), Tailwind 4, Bun’s test runner.

## License

next-forge is MIT. This repo carries no license file of its own yet, so the code
written for hasToggle is public to read and not yet licensed for reuse.

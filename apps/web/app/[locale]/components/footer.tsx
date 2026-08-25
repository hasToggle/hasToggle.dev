import { cacheLife } from "next/cache";
import { Container } from "./container";
import { Logo } from "./logo";
import { Link } from "./marketing-link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { ThemeSwitch } from "./theme-switch";

function SitemapHeading({ children }: { children: React.ReactNode }) {
  return (
    // `/60`, not `/50`: the sitemap label sits on the footer's `bg-muted`
    // band, where `/50` measures 3.67:1 at 14px against the 4.5:1 floor.
    <h3 className="font-medium text-foreground/60 text-sm/6">{children}</h3>
  );
}

function SitemapLinks({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-4 text-sm/6">{children}</ul>;
}

function ExternalIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function SitemapLink({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  // The icon is derived from `target`, not passed in, so a link can never
  // open a tab without saying so.
  const opensNewTab = props.target === "_blank";

  return (
    <li>
      <Link
        {...props}
        className="font-medium text-foreground hover:text-foreground/75"
      >
        {children}
        {opensNewTab && (
          <>
            {/* Inline, not a flex child: the column is narrow enough that
                these labels wrap, and a flex icon parks itself beside the
                whole wrapped block instead of following the last word. */}
            <ExternalIcon className="ml-1 inline size-3 align-[-0.08em] opacity-60" />
            {/* The glyph is the sighted half of this; screen readers get the
                same fact in words rather than a shrug. */}
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </Link>
    </li>
  );
}

function Sitemap() {
  // Two categories, two columns each on lg (the longest label plus its icon
  // overflows a single subgrid column): where the site goes, and how it is
  // made. "Built in the open" is the roadmap aside's own phrase.
  return (
    <>
      <div className="lg:col-span-2">
        <SitemapHeading>Playground</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/lab">The lab</SitemapLink>
          <SitemapLink href="/blog">Blog</SitemapLink>
          <SitemapLink href="/#faq">FAQs</SitemapLink>
          <SitemapLink href="/contact">Contact</SitemapLink>
        </SitemapLinks>
      </div>
      <div className="lg:col-span-2">
        <SitemapHeading>Built in the open</SitemapHeading>
        <SitemapLinks>
          <SitemapLink
            href="https://github.com/hasToggle/hasToggle.dev"
            target="_blank"
          >
            Source on GitHub
          </SitemapLink>
          <SitemapLink
            href="https://github.com/hasToggle/hasToggle.dev-checkpoints"
            target="_blank"
          >
            Prompts and checkpoints
          </SitemapLink>
        </SitemapLinks>
      </div>
    </>
  );
}

function SocialIconGitHub(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function SocialIconX(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M12.6 0h2.454l-5.36 6.778L16 16h-4.937l-3.867-5.594L2.771 16H.316l5.733-7.25L0 0h5.063l3.495 5.114L12.6 0zm-.86 14.376h1.36L4.323 1.539H2.865l8.875 12.837z" />
    </svg>
  );
}

function SocialIconYouTube(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 576 512"
      {...props}
    >
      <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
    </svg>
  );
}

function SocialIconLinkedIn(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z" />
    </svg>
  );
}

function SocialLinks() {
  return (
    <>
      <Link
        aria-label="Read the hasToggle source on GitHub"
        className="text-foreground hover:text-foreground/75"
        href="https://github.com/hasToggle/hasToggle.dev"
        target="_blank"
      >
        <SocialIconGitHub className="size-4" />
      </Link>
      <Link
        aria-label="Visit Eric on YouTube"
        className="text-foreground hover:text-foreground/75"
        href="https://www.youtube.com/@hastoggle"
        target="_blank"
      >
        <SocialIconYouTube className="size-6" />
      </Link>
      <Link
        aria-label="DM Eric on X"
        className="text-foreground hover:text-foreground/75"
        href="https://x.com/hasToggle"
        target="_blank"
      >
        <SocialIconX className="size-4" />
      </Link>
      <Link
        aria-label="Connect with Eric on LinkedIn"
        className="text-foreground hover:text-foreground/75"
        href="https://www.linkedin.com/in/ernst-stolz"
        target="_blank"
      >
        <SocialIconLinkedIn className="size-4" />
      </Link>
    </>
  );
}

// biome-ignore lint/suspicious/useAwait: `use cache` only works on async functions, even when nothing awaits
async function Copyright() {
  // Cached because with Cache Components, even `new Date()` is a decision:
  // bake it, or defer it. The year can safely be a day stale.
  "use cache";
  cacheLife("days");

  return (
    <div className="text-foreground text-sm/6">
      &copy; {new Date().getFullYear()} hasToggle.
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-muted">
      <Container>
        <PlusGrid className="pt-16 pb-16">
          <PlusGridRow>
            <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
              <div className="col-span-2 flex">
                <PlusGridItem className="pt-6 lg:pb-6">
                  <Logo
                    className="inline-block h-6 text-foreground"
                    fill="currentColor"
                  />
                </PlusGridItem>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid lg:pt-6">
                <Sitemap />
              </div>
            </div>
          </PlusGridRow>
          <PlusGridRow className="flex justify-between">
            <div>
              <PlusGridItem className="py-3">
                <Copyright />
              </PlusGridItem>
            </div>
            <div>
              {/* `text-foreground/60`, not `text-muted-foreground`: that
                  token is tuned for the page background, and on this muted
                  band it lands at 4.35:1 — just under the floor. */}
              <div className="py-3 text-center text-foreground/60 text-sm/6">
                Come back Monday. There&rsquo;ll be something new to poke.
              </div>
            </div>
            <div className="flex">
              {/* The utility corner: the theme pill boards the social row —
                  controls beside pointers, none of it in the top nav. Two
                  adjacent items, so the grid draws its shared corners
                  between them: the pluses are the separator. */}
              <PlusGridItem className="flex items-center px-5 py-3">
                <ThemeSwitch />
              </PlusGridItem>
              <PlusGridItem className="flex items-center gap-8 px-5 py-3">
                <SocialLinks />
              </PlusGridItem>
            </div>
          </PlusGridRow>
        </PlusGrid>
        {/* Was full-strength `muted-foreground`, chosen over `/80` to clear
            the 4.5:1 floor. It did not: measured against this band the solid
            token is 4.35:1, so the earlier fix moved in the right direction
            and stopped short. `text-foreground/60` is 5.11:1. */}
        <div className="pb-10 text-center text-foreground/60 text-xs/5">
          {/* The imprint must be reachable from every page (§ 5 DDG: easily
              recognizable, directly accessible) — this footer is that path. */}
          <p>
            <Link
              className="transition-colors hover:text-foreground"
              href="/legal/imprint"
            >
              Imprint
            </Link>
            <span aria-hidden="true" className="px-2">
              ·
            </span>
            <Link
              className="transition-colors hover:text-foreground"
              href="/legal/privacy"
            >
              Privacy
            </Link>
          </p>
          <p className="mt-2">
            hasToggle is an independent project, not affiliated with or endorsed
            by Vercel. Next.js and Vercel are trademarks of Vercel, Inc.
          </p>
        </div>
      </Container>
    </footer>
  );
}

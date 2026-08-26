import { Logo } from "./logo";
import { Link } from "./marketing-link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";

const links: { href: string; label: string }[] = [
  { href: "/lab", label: "The lab" },
  { href: "/blog", label: "Blog" },
];

function Nav({ variant }: { variant: "light" | "dark" }) {
  // The items sit adjacent on purpose: the plus grid frames a unit the way
  // it frames the logo only when neighbors touch — the first item takes the
  // leading corners and the chain shares the rest. A gap breaks the frame
  // into stray marks.
  return (
    <nav className="relative flex">
      {links.map(({ href, label }) => (
        <PlusGridItem className="relative flex" key={href} variant={variant}>
          <Link
            className={`flex items-center whitespace-nowrap px-3 py-3 font-medium text-sm transition-colors sm:px-4 sm:text-base ${variant === "dark" ? "text-white" : "text-foreground"} hover:bg-black/2.5 dark:hover:bg-white/5`}
            href={href}
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
    </nav>
  );
}

export function Navbar({
  banner,
  variant = "light",
}: {
  banner?: React.ReactNode;
  variant?: "light" | "dark";
}) {
  return (
    <header className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow
          className="relative flex justify-between"
          variant={variant}
        >
          <div className="relative flex gap-6">
            {/* A plain div, not a PlusGridItem: two lone corner marks around
                the wordmark read as an unfinished frame. The pluses belong
                to the interactive boxes; the logo gets the rules alone. */}
            <div className="py-3">
              <Link href="/" title="Home">
                <Logo
                  className="inline-block h-6"
                  fill={variant === "dark" ? "white" : "var(--foreground)"}
                />
              </Link>
            </div>
            {banner ? (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            ) : null}
          </div>
          {/* Destinations hold the right edge; the theme control lives in
              the footer's utility row now, so nothing shares this corner. */}
          <Nav variant={variant} />
        </PlusGridRow>
      </PlusGrid>
    </header>
  );
}

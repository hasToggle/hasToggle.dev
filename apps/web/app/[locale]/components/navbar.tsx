import { Logo } from "./logo";
import { Link } from "./marketing-link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { ThemeSwitch } from "./theme-switch";

const links: { href: string; label: string }[] = [
  { href: "/lab", label: "The lab" },
  { href: "/blog", label: "Blog" },
];

function Nav({ variant }: { variant: "light" | "dark" }) {
  // Hidden on phones: at 390px the two labels wrap and stack the logo —
  // the crowding this layout exists to avoid. The footer's sitemap carries
  // The lab and Blog there.
  return (
    <nav className="relative hidden sm:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem className="relative flex" key={href} variant={variant}>
          <Link
            className={`flex items-center whitespace-nowrap px-4 py-3 font-medium text-base ${variant === "dark" ? "text-white" : "text-foreground"} bg-blend-multiply hover:bg-black/2.5`}
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
          {/* Navigation travels with the identity: destinations on the left,
              beside the logo — never sharing the corner with the controls,
              which keeps the two hierarchies apart by geography. */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            <PlusGridItem className="shrink-0 py-3" variant={variant}>
              <Link href="/" title="Home">
                <Logo
                  className="inline-block h-6"
                  fill={variant === "dark" ? "white" : "var(--foreground)"}
                />
              </Link>
            </PlusGridItem>
            <Nav variant={variant} />
            {banner ? (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            ) : null}
          </div>
          {/* The corner every editor keeps its view switches in. */}
          <div className="relative flex items-center">
            <ThemeSwitch variant={variant} />
          </div>
        </PlusGridRow>
      </PlusGrid>
    </header>
  );
}

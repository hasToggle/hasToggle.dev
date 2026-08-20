import { Logo } from "./logo";
import { Link } from "./marketing-link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { ThemeSwitch } from "./theme-switch";

const links: { href: string; label: string }[] = [];

function DesktopNav({ variant }: { variant: "light" | "dark" }) {
  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem className="relative flex" key={href} variant={variant}>
          <Link
            className={`flex items-center px-4 py-3 font-medium text-base ${variant === "dark" ? "text-white" : "text-foreground"} bg-blend-multiply hover:bg-black/2.5`}
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
            <PlusGridItem className="py-3" variant={variant}>
              <Link href="/" title="Home">
                <Logo
                  className="inline-block h-6"
                  fill={variant === "dark" ? "white" : "var(--foreground)"}
                />
              </Link>
            </PlusGridItem>
            {banner ? (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            ) : null}
          </div>
          {/* The corner every editor keeps its view switches in. */}
          <div className="relative flex items-center gap-6">
            <DesktopNav variant={variant} />
            <ThemeSwitch variant={variant} />
          </div>
        </PlusGridRow>
      </PlusGrid>
    </header>
  );
}

import { Container } from "./container";
import { Digest } from "./digest";
import { Gradient } from "./gradient";
import { Logo } from "./logo";
import { Link } from "./marketing-link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { Subheading } from "./text";

function CallToAction() {
  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <Subheading>Get your nuts together</Subheading>
        <p className="mt-6 font-medium text-3xl text-gray-950 tracking-tight sm:text-5xl">
          Hazel is waiting for you.
          <br />
          Sign up for the weekly digest today.
        </p>
      </hgroup>
      <p className="mx-auto mt-6 max-w-xs text-gray-500 text-sm/6">
        Practical coding tips, every Monday, right in your inbox.
      </p>

      <Digest />
    </div>
  );
}

function SitemapHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-medium text-gray-950/50 text-sm/6">{children}</h3>;
}

function SitemapLinks({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-4 text-sm/6">{children}</ul>;
}

function SitemapLink(props: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <li>
      <Link
        {...props}
        className="font-medium text-gray-950 hover:text-gray-950/75"
      />
    </li>
  );
}

function Sitemap() {
  return (
    <div>
      <SitemapHeading>Product</SitemapHeading>
      <SitemapLinks>
        <SitemapLink href="/#faq">FAQs</SitemapLink>
      </SitemapLinks>
    </div>
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
        aria-label="Visit Eric on YouTube"
        className="text-gray-950 hover:text-gray-950/75"
        href="https://www.youtube.com/@hastoggle"
        target="_blank"
      >
        <SocialIconYouTube className="size-6" />
      </Link>
      <Link
        aria-label="DM Eric on X"
        className="text-gray-950 hover:text-gray-950/75"
        href="https://x.com/hasToggle"
        target="_blank"
      >
        <SocialIconX className="size-4" />
      </Link>
      <Link
        aria-label="Connect with Eric on LinkedIn"
        className="text-gray-950 hover:text-gray-950/75"
        href="https://www.linkedin.com/in/ernst-stolz"
        target="_blank"
      >
        <SocialIconLinkedIn className="size-4" />
      </Link>
    </>
  );
}

function Copyright() {
  return (
    <div className="text-gray-950 text-sm/6">
      &copy; {new Date().getFullYear()} hasToggle.
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-4xl bg-slate-50/90" />
        <Container>
          <CallToAction />
          <PlusGrid className="pb-16">
            <PlusGridRow>
              <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                <div className="col-span-2 flex">
                  <PlusGridItem className="pt-6 lg:pb-6">
                    <Logo className="inline-block h-6" fill="black" />
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
                <div className="py-3 text-center text-gray-500 text-sm/6">
                  because cracking the code shouldn&apos;t drive you nuts
                  {" \uD83D\uDC3F\uFE0F"}
                </div>
              </div>
              <div className="flex">
                <PlusGridItem className="flex items-center gap-8 py-3">
                  <SocialLinks />
                </PlusGridItem>
              </div>
            </PlusGridRow>
          </PlusGrid>
        </Container>
      </Gradient>
    </footer>
  );
}

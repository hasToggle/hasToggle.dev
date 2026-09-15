import { Container } from "./container";
import { Footer } from "./footer";
import { MarketingButton } from "./marketing-button";
import { Navbar } from "./navbar";
import { Heading, Subheading } from "./text";

/**
 * The 404 in site chrome. Rendered from two places: the app root, which is
 * where Next sends any URL no route claims (a mistyped chapter slug, an
 * unknown locale prefix), and the locale segment, for `notFound()` thrown by
 * a page that knows its slug list.
 */
export function NotFoundPage() {
  return (
    <div className="overflow-x-clip">
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
            <div aria-hidden="true" />
            <div>
              <Subheading as="div">404</Subheading>
              <Heading
                as="h1"
                className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
              >
                Nothing lives at this address.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                The link may be older than the page it pointed at, or a
                character short. The contents page lists every chapter that has
                shipped.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <MarketingButton href="/lab">Open the contents</MarketingButton>
                <MarketingButton href="/" variant="outline">
                  Back to the playground
                </MarketingButton>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { ogCard, PAGE_OG_TITLES } from "@/app/api/og/title";
import { Container } from "../components/container";
import { Footer } from "../components/footer";
import { Link } from "../components/marketing-link";
import { ASIDE_LINK_CLASS, MetaAside } from "../components/meta-aside";
import { Navbar } from "../components/navbar";
import { Heading, Subheading } from "../components/text";
import { ContactForm } from "./components/contact-form";

export const metadata: Metadata = {
  description:
    "A question about a chapter, something that looks broken, an idea the lab should steal — it all lands in one inbox, and a person answers.",
  title: "Contact — hasToggle",
  ...ogCard(PAGE_OG_TITLES.contact),
};

export default function ContactPage() {
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
              <Subheading as="div">Contact</Subheading>
              <Heading
                as="h1"
                className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
              >
                Write to Eric.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                A question about a chapter, something that looks broken, an idea
                the lab should steal — it all lands in one inbox, and a person
                answers.
              </p>

              <div className="mt-12 max-w-xl">
                <ContactForm />
              </div>

              <MetaAside className="mt-8 max-w-xl" variant="comment">
                The form is a Server Action wired straight to an email inbox —
                the lesson from{" "}
                <Link className={ASIDE_LINK_CLASS} href="/lab/server-actions">
                  the mutation chapter
                </Link>
                , doing its day job.
              </MetaAside>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

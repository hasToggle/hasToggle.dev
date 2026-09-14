import type { ReactElement } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";
import { assetUrl } from "../assets";

interface DigestEmailProps {
  archiveUrl?: string;
  content: string;
  misconception: string;
  series?: {
    name: string;
    part: number;
  };
  title: string;
  /**
   * Required on purpose: a digest without an unsubscribe link must not
   * compile. Digests go out as Resend broadcasts, so the send passes
   * `RESEND_UNSUBSCRIBE_URL` (see packages/email/broadcast.ts) and Resend
   * substitutes each recipient's link. The click flips the contact's
   * `unsubscribed` flag; apps/web's Resend webhook turns that into the
   * deletion the privacy policy promises.
   */
  unsubscribeUrl: string;
}

function DigestEmail({
  title,
  misconception,
  content,
  series,
  archiveUrl,
  unsubscribeUrl,
}: DigestEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            alt="hasToggle"
            height={40}
            src={assetUrl("logo.png")}
            width={30}
          />
          {series ? (
            <Text style={seriesLabel}>
              {series.name} &mdash; Part {series.part}
            </Text>
          ) : null}
          <Heading style={heading}>{title}</Heading>
          <Text style={misconceptionStyle}>
            Misconception: &ldquo;{misconception}&rdquo;
          </Text>
          <Hr style={hr} />
          <Text style={body}>{content}</Text>
          {archiveUrl ? (
            <Section style={ctaSection}>
              <Button href={archiveUrl} style={button}>
                Read in the app
              </Button>
            </Section>
          ) : null}
          <Hr style={hr} />
          <Text style={footer}>
            You&apos;re receiving this because you subscribed to the hasToggle
            weekly digest.{" "}
            <Link href={unsubscribeUrl} style={footerLink}>
              Unsubscribe
            </Link>{" "}
            &mdash; one click, and it works the first time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

DigestEmail.PreviewProps = {
  archiveUrl: "https://app.hastoggle.dev/digest/123",
  content: "Here's why understanding how things work still matters...",
  misconception: "AI writes all the code for me",
  series: { name: "The AI Toolchain", part: 1 },
  title: "You don't need to learn to code",
  unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}",
} satisfies DigestEmailProps;

export default DigestEmail;

// Styles — match existing template patterns
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  margin: "40px auto",
  maxWidth: "600px",
  padding: "40px 48px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "700" as const,
  lineHeight: "1.3",
  margin: "16px 0",
};

const seriesLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600" as const,
  letterSpacing: "0.05em",
  margin: "24px 0 0",
  textTransform: "uppercase" as const,
};

const misconceptionStyle = {
  color: "#6b7280",
  fontSize: "16px",
  fontStyle: "italic" as const,
  margin: "0 0 16px",
};

const body = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const ctaSection = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#1a1a1a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline" as const,
};

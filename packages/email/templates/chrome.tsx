import type { ReactNode } from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";
import { assetUrl, PUBLIC_ORIGIN } from "../assets";

interface ChromeProps {
  readonly children: ReactNode;
  readonly preview: string;
}

/**
 * The shell every transactional mail shares: masthead, content card and the
 * imprint footer. Templates supply the preview line and the card contents.
 */
export const Chrome = ({ children, preview }: ChromeProps) => (
  <Html lang="en">
    <Head>
      {/* Keep the mail in light mode: the header is dark on purpose and a
          client-side inversion would wash it out. */}
      <meta content="light" name="color-scheme" />
      <meta content="light" name="supported-color-schemes" />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={masthead}>
          <Row>
            <Column style={markCell}>
              <Link href={PUBLIC_ORIGIN} style={markLink}>
                <Img
                  alt="hasToggle"
                  height={40}
                  src={assetUrl("logo.png")}
                  style={mark}
                  width={30}
                />
              </Link>
            </Column>
            <Column style={wordmarkCell}>
              <Link href={PUBLIC_ORIGIN} style={wordmark}>
                hasToggle
              </Link>
            </Column>
          </Row>
        </Section>

        <Section style={content}>{children}</Section>
      </Container>

      <Container style={footer}>
        <Text style={footerText}>
          <Link href={PUBLIC_ORIGIN} style={footerLink}>
            hasToggle
          </Link>
          {", "}
          {/* The address is a link so Apple Mail's data detector does not
              turn it into a blue underlined map link of its own. */}
          <Link href={`${PUBLIC_ORIGIN}/legal/imprint`} style={footerLink}>
            Limberger Straße 40, 49080 Osnabrück, Germany
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// The masthead colour is sampled from the edges of logo.png, so the mark's
// own background merges with the band instead of sitting on it as a tile.
const ink = "#1b1424";

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily,
  margin: 0,
  padding: "40px 16px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  overflow: "hidden" as const,
};

const masthead = {
  backgroundColor: ink,
  padding: "18px 40px",
};

const markCell = {
  verticalAlign: "middle" as const,
  width: "42px",
};

const markLink = {
  display: "inline-block",
  lineHeight: 0,
};

const mark = {
  borderRadius: "6px",
  display: "block",
};

const wordmarkCell = {
  verticalAlign: "middle" as const,
};

const wordmark = {
  color: "#ffffff",
  fontFamily,
  fontSize: "19px",
  fontWeight: 600 as const,
  letterSpacing: "-0.01em",
  lineHeight: "40px",
  textDecoration: "none",
};

const content = {
  padding: "36px 40px 32px",
};

const footer = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "20px 40px 0",
};

const footerText = {
  color: "#71717a",
  fontSize: "12px",
  lineHeight: "18px",
  margin: 0,
};

const footerLink = {
  color: "#71717a",
  textDecoration: "none",
};

// Styles for the card contents, shared so the templates read as one voice.

export const heading = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: 600 as const,
  letterSpacing: "-0.02em",
  lineHeight: "32px",
  margin: "0 0 12px",
};

export const body = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 28px",
};

export const ctaSection = {
  margin: "0 0 28px",
};

export const button = {
  backgroundColor: "#18181b",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily,
  fontSize: "16px",
  fontWeight: 600 as const,
  lineHeight: "24px",
  padding: "12px 28px",
  textDecoration: "none",
};

export const signoff = body;

export const fineprintLink = {
  color: "#3f3f46",
  textDecoration: "underline",
};

export const fineprint = {
  borderTop: "1px solid #e4e4e7",
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: 0,
  paddingTop: "20px",
};

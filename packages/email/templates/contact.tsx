import { Fragment } from "react";
import { Button, Column, Row, Section, Text } from "react-email";
import { body, button, Chrome, ctaSection, fineprint, heading } from "./chrome";

interface ContactTemplateProps {
  readonly email: string;
  readonly message: string;
  readonly name: string;
  /** When the form was submitted. Named in the mail so a reply can place it. */
  readonly sentAt: Date;
}

const formatSentAt = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Europe/Berlin",
    timeZoneName: "short",
    year: "numeric",
  }).format(date);

/** How much of the message the inbox list shows before the mail is opened. */
const PREVIEW_LENGTH = 140;

const WHITESPACE = /\s+/g;
const LINE_BREAK = /\r?\n/;

const previewOf = (message: string) => {
  const oneLine = message.replace(WHITESPACE, " ").trim();
  return oneLine.length > PREVIEW_LENGTH
    ? `${oneLine.slice(0, PREVIEW_LENGTH - 1).trimEnd()}…`
    : oneLine;
};

/**
 * The visitor typed line breaks on purpose. Mail clients collapse them in
 * text, so each one becomes a <br /> and the block also asks for pre-wrap.
 */
const withLineBreaks = (message: string) =>
  message.split(LINE_BREAK).map((line, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));

/**
 * What lands in the inbox when the contact form is submitted. The reader is
 * the person answering, so the mail is built for triage: who wrote, when,
 * what they said, and a reply that goes straight back to them.
 */
const ContactTemplate = ({
  name,
  email,
  message,
  sentAt,
}: ContactTemplateProps) => (
  <Chrome preview={`${name}: ${previewOf(message)}`}>
    <Text style={heading}>{`${name} wrote in.`}</Text>

    <Section style={meta}>
      <Row>
        <Column style={metaLabel}>From</Column>
        <Column style={metaValue}>
          {name}
          <br />
          <a href={`mailto:${email}`} style={metaLink}>
            {email}
          </a>
        </Column>
      </Row>
      <Row>
        <Column style={metaLabel}>Sent</Column>
        <Column style={metaValue}>{formatSentAt(sentAt)}</Column>
      </Row>
    </Section>

    <Section style={quote}>
      <Text style={quoteText}>{withLineBreaks(message)}</Text>
    </Section>

    <Section style={ctaSection}>
      <Button href={`mailto:${email}`} style={button}>
        {`Reply to ${name}`}
      </Button>
    </Section>

    <Text style={fineprint}>
      Reply goes to the address above: the form set it as Reply-To. Nothing
      about it was verified, so treat any link in the message the way you would
      treat one from a stranger, which is what it is.
    </Text>
  </Chrome>
);

const meta = {
  borderBottom: "1px solid #e4e4e7",
  borderTop: "1px solid #e4e4e7",
  margin: "0 0 24px",
  padding: "14px 0",
};

const metaLabel = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: 600 as const,
  letterSpacing: "0.06em",
  lineHeight: "24px",
  paddingRight: "16px",
  textTransform: "uppercase" as const,
  verticalAlign: "top" as const,
  width: "64px",
};

const metaValue = {
  color: "#18181b",
  fontSize: "15px",
  lineHeight: "24px",
  verticalAlign: "top" as const,
};

const metaLink = {
  color: "#18181b",
  textDecoration: "underline",
  textDecorationColor: "#a1a1aa",
  textUnderlineOffset: "3px",
};

const quote = {
  borderLeft: "3px solid #d4d4d8",
  margin: "0 0 28px",
  paddingLeft: "20px",
};

const quoteText = {
  ...body,
  color: "#18181b",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

ContactTemplate.PreviewProps = {
  email: "jane.smith@example.com",
  message:
    "The rebake chapter says the shelf refills on the next request, but on my deployment the second request still shows the old bake.\n\nAm I reading the readout wrong, or is something else going on?",
  name: "Jane Smith",
  sentAt: new Date("2026-09-16T14:52:00Z"),
};

export default ContactTemplate;

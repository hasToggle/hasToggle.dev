import { Button, Link, Section, Text } from "react-email";
import { PUBLIC_ORIGIN } from "../assets";
import {
  body,
  button,
  Chrome,
  ctaSection,
  fineprint,
  fineprintLink,
  heading,
  signoff,
} from "./chrome";

interface ConfirmSubscriptionProps {
  /**
   * Origin the signup arrived on. The confirm link goes back there so a
   * signup on localhost or a preview deployment confirms against the same
   * deployment. Images never use it; see `assets.ts`.
   */
  readonly baseUrl?: string;
  readonly token: string;
  /** Ours, signed per subscriber; see already-subscribed.tsx for why. */
  readonly unsubscribeUrl: string;
}

const ConfirmSubscription = ({
  token,
  baseUrl = PUBLIC_ORIGIN,
  unsubscribeUrl,
}: ConfirmSubscriptionProps) => (
  <Chrome preview="Confirm below and you’re on the cohort waitlist: first to hear when seats open, and when a chapter ships that the cohort will build on.">
    <Text style={heading}>One click and you’re on the waitlist.</Text>
    <Text style={body}>
      hasToggle is the unofficial live playground for Next.js and Vercel. The
      playground is free, and it stays open whether you confirm or not.
    </Text>
    <Text style={body}>
      The waitlist is for the cohort: small paid groups building production web
      apps with the same AI workflow that built the site. Confirm below and
      you’re first to hear when seats open, and when a new chapter lands.
    </Text>
    <Section style={ctaSection}>
      <Button href={`${baseUrl}/api/confirmed?token=${token}`} style={button}>
        Confirm
      </Button>
    </Section>
    <Text style={signoff}>
      Good to have you.
      <br />
      Eric
    </Text>
    <Text style={fineprint}>
      The link works for 24 hours. If you didn’t ask for this, ignore it and you
      won’t hear from us, or{" "}
      <Link href={unsubscribeUrl} style={fineprintLink}>
        remove the address now
      </Link>
      .
    </Text>
  </Chrome>
);

ConfirmSubscription.PreviewProps = {
  baseUrl: "https://example.com",
  token: "abc123",
  unsubscribeUrl: "https://example.com/api/unsubscribe?id=abc&sig=def",
};

export default ConfirmSubscription;

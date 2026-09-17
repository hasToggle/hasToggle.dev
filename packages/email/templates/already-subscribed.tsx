import { Link, Text } from "react-email";
import {
  body,
  Chrome,
  fineprint,
  fineprintLink,
  heading,
  signoff,
} from "./chrome";

interface AlreadySubscribedProps {
  /** When the address confirmed. Named in the mail so the reader can place it. */
  readonly confirmedAt: Date;
  /**
   * Required on purpose: this is transactional mail, so Resend adds no
   * unsubscribe link of its own (that is a broadcast feature). The link is
   * ours, signed per subscriber — see apps/web/lib/unsubscribe-link.
   */
  readonly unsubscribeUrl: string;
}

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);

/**
 * Sent when a confirmed address signs up again. The form's reply is the
 * same for every outcome, so this mail is where the reader learns nothing
 * needed doing.
 */
const AlreadySubscribed = ({
  confirmedAt,
  unsubscribeUrl,
}: AlreadySubscribedProps) => (
  <Chrome preview="You confirmed already, and you’re still in. When cohort seats open, this address hears first.">
    <Text style={heading}>You’re already on the waitlist.</Text>
    <Text style={body}>
      You confirmed on {formatDay(confirmedAt)}, and you’re still in. Signing up
      twice usually means a new laptop, a cleared autofill, or a fair doubt
      about whether the first one took. It took. When cohort seats open, this
      address hears first.
    </Text>
    <Text style={signoff}>
      Still good to have you.
      <br />
      Eric
    </Text>
    <Text style={fineprint}>
      If you didn’t send this, someone typed your address into the form, and
      nothing about your subscription changed. If you’d rather not be on the
      list at all,{" "}
      <Link href={unsubscribeUrl} style={fineprintLink}>
        leave it here
      </Link>
      : one press, no questions.
    </Text>
  </Chrome>
);

AlreadySubscribed.PreviewProps = {
  confirmedAt: new Date("2026-09-03T10:00:00Z"),
  unsubscribeUrl: "https://example.com/api/unsubscribe?id=abc&sig=def",
};

export default AlreadySubscribed;

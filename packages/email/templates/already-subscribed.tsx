import { Text } from "react-email";
import { body, Chrome, fineprint, heading, signoff } from "./chrome";

interface AlreadySubscribedProps {
  /** When the address confirmed. Named in the mail so the reader can place it. */
  readonly confirmedAt: Date;
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
const AlreadySubscribed = ({ confirmedAt }: AlreadySubscribedProps) => (
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
      If you didn’t send this, someone typed your address into the form. Nothing
      about your subscription changed, and every digest still ends with its
      unsubscribe link.
    </Text>
  </Chrome>
);

AlreadySubscribed.PreviewProps = {
  confirmedAt: new Date("2026-09-03T10:00:00Z"),
};

export default AlreadySubscribed;

import { Link, Text } from "react-email";
import { PUBLIC_ORIGIN } from "../assets";
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
  <Chrome preview="Nothing to click this time. You confirmed already, and the seat notice still goes to this address first.">
    <Text style={heading}>You’re already on the waitlist.</Text>
    <Text style={body}>
      This address confirmed on {formatDay(confirmedAt)}, so there is nothing to
      click this time. When cohort seats open, you hear before anyone else.
      Until then,{" "}
      <Link href={PUBLIC_ORIGIN} style={link}>
        the playground is open
      </Link>
      .
    </Text>
    <Text style={signoff}>
      Good to have you, still.
      <br />
      Eric
    </Text>
    <Text style={fineprint}>
      Every digest carries an unsubscribe link, and it works the first time. If
      you didn’t send this, someone typed your address into the form; nothing
      changed, and nothing will.
    </Text>
  </Chrome>
);

AlreadySubscribed.PreviewProps = {
  confirmedAt: new Date("2026-09-03T10:00:00Z"),
};

export default AlreadySubscribed;

const link = {
  color: "#18181b",
  textDecoration: "underline",
};

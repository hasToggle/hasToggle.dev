import { MetaAside } from "../../components/meta-aside";

export function IncidentEssay() {
  return (
    <div className="space-y-4 text-foreground/75 leading-7">
      <p>
        January 2026. Candidate profiles started disappearing from the database
        — the kind of disappearing that happens because a daily cron job has
        decided they should. The affected users had renewed their profiles in
        good standing. The records were gone anyway.
      </p>
      <p>
        The culprit was a validation rule from version one. When profiles were
        first introduced, every profile was created exactly once and stamped
        with a <code>createdAt</code>. The schema enforced it:{" "}
        <code>z.coerce.date()</code>. If anything went sideways and the field
        was missing, the rule would coerce it to <em>something</em> and the
        record would still pass validation. That was the safe choice in v1,
        because there was no v2.
      </p>
      <p>
        Then renewal was added. A renewal request <em>intentionally omits</em>{" "}
        <code>createdAt</code> — the system is supposed to keep whatever was
        there. The validation rule still ran, of course. It was right where it
        had always been. It read <code>undefined</code>, did what it was told to
        do with <code>undefined</code>, and produced January 1, 1970. Epoch
        zero. Fifty-six years in the past.&thinsp;*
      </p>
      <p>
        The cleanup job had also been there since v1. It deleted profiles older
        than twelve months. From its perspective, the renewed profiles were
        fifty-five years past their expiry date. It did its job. The records
        were physically removed.
      </p>
      <p>
        The reason this survived for so long is the most ordinary part: there
        were no tests characterizing what the validation rule did with{" "}
        <code>undefined</code>. The behavior had been correct in v1, so nobody
        wrote it down. The behavior in v2 changed silently, because the rule
        itself didn&apos;t change — only the world around it did.
      </p>
      <p>
        The lesson the post-mortem landed on was about tests, but the lesson
        underneath is about inheritance. A guardrail you stopped questioning is
        no longer a guardrail. It&apos;s just a default with old assumptions
        baked in. AI inherits these the way it inherits everything else:
        cheerfully, without auditing the assumptions, building on top until the
        assumptions break.
      </p>
      <MetaAside className="mt-4" noMarker>
        * The Unix epoch was supposed to be a sensible default for &ldquo;the
        beginning of time.&rdquo; It works fine until the beginning of time
        starts showing up in your production data.
      </MetaAside>
    </div>
  );
}

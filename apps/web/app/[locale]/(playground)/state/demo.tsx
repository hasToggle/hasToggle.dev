import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { ReplayCode } from "./replay-code";
import { STATE_SOURCE } from "./source";
import { StatePanel } from "./state-panel";

const chapter = requireChapter("state");

interface StateDemoProps {
  headingAs?: "h1" | "h2";
}

export function StateDemo({ headingAs }: StateDemoProps) {
  return (
    <DemoSection
      belief={chapter.belief}
      chapter={chapter.n}
      headingAs={headingAs}
      id={`demo-${chapter.n}`}
      intro={
        <>
          <p>
            You don&rsquo;t — for the counting. A component is a function:
            render means React calls it and paints what it returns. A{" "}
            <InlineCode>let</InlineCode> inside that function is born in the
            call and dies with it, so adding one to it works — and changes
            nothing on screen, because changing a value and repainting the
            screen are two different jobs. <InlineCode>useState</InlineCode>
            &#32;is how a counter gets both: the setter stores the value where
            React keeps it between calls, and it schedules the call — the render
            — that paints it.
          </p>
          <p>
            Press +1 and the number moves, the way counters always have. Now
            flip narrate and press again: the card turns over and replays the
            click against its own source, slowly — the press, where the closure
            still reads the old value; the fresh call to StateCard(); useState
            handing back the value React kept; the paint. Then it turns back,
            and the number has moved. Everything in the replay happened before
            the card finished turning. It is slowed, not simulated, and the
            values in it were read live.
          </p>
          <p>
            Kept where? Press &ldquo;Re-render the panel&rdquo; in the deck: the
            component runs again — watch the render badge tick — and the count
            comes back unchanged. A plain variable would have been re-declared
            at zero by that same render. The state variable is stored with
            React, outside the call, which is why a re-render cannot touch it.
          </p>
        </>
      }
      meta={
        <>
          The fine print: the card can&rsquo;t actually slow React down — the
          new number existed before the card finished turning. What you&rsquo;re
          watching is a millisecond, replayed with the values it happened with.
        </>
      }
      topic={chapter.topic}
    >
      {/* The client panel owns the instrument: narrate mode and the
          re-render pass are its view state, and the +1 button stays in the
          card — it is the specimen, not a control (design.md §4). The
          replay's source arrives server-highlighted through props, so no
          highlighter ships to the browser. */}
      <StatePanel
        references={
          <ReferenceBar
            docsHref="https://react.dev/learn/state-a-components-memory"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/state"
          >
            <CodeBlock code={STATE_SOURCE} file="state-card.tsx" />
          </ReferenceBar>
        }
        replayCode={<ReplayCode />}
      />
    </DemoSection>
  );
}

import { chapterSourceHref, requireChapter } from "../../lab/syllabus";
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
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            A component is a function. Render means React calls it and paints
            what it returns, so a value that has to survive from one call to the
            next needs somewhere to live in between.{" "}
            <InlineCode>useState</InlineCode>&#32;is that place. The setter does
            two jobs: it stores the new value where React keeps it, and it
            schedules the next call, the render that paints it.
          </p>
          <p>
            Press +1 and the number moves, the way counters always have. Flip
            slow motion and press again to see the render that moved it: React
            runs StateCard() again, top to bottom, useState hands back the value
            it kept, and the line that paints the count paints the new one. Then
            the number has moved.
          </p>
        </>
      }
      meta={
        <>
          The replay cannot slow React down. The new number existed before the
          first line lit. What you are watching is a millisecond, replayed with
          the values it happened with.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
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
            sourceHref={chapterSourceHref(chapter)}
          >
            <CodeBlock code={STATE_SOURCE} file="state-card.tsx" />
          </ReferenceBar>
        }
        replayCode={<ReplayCode />}
      />
    </DemoSection>
  );
}

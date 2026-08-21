import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
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
            call and dies with it, so &ldquo;add one to count&rdquo; works every
            time you press — and changes nothing on screen, because changing a
            value and repainting the screen are two different jobs, and the
            variable only ever had the first one.
          </p>
          <p>
            Watch the left card. Press +1 and the small line reports the
            variable faithfully going up — written to the DOM by hand, because
            React was never told and is not coming back. The big number is what
            React painted the last time it ran the function: zero. Now press
            &ldquo;Re-render the panel&rdquo; below and watch the same line —
            the fresh call re-declares the variable, and your threes and fours
            are simply gone.
          </p>
          <p>
            The right card asks <InlineCode>useState</InlineCode> for its count.
            The setter does both jobs at once: it stores the value where React
            keeps it between calls, and it schedules the next call — the render
            — that paints it. Flip narrate and press +1 again: the two events
            report themselves in order, including the part nobody believes until
            they see it — inside the click that asked for 4, the variable still
            reads 3. The new value doesn&rsquo;t exist until the next render
            does.
          </p>
        </>
      }
      meta={
        <>
          The fine print: to show you a variable React won&rsquo;t render, this
          page writes the small line to the DOM by hand — the demo has to sneak
          past React to report what React ignores. The workaround is the
          exhibit.
        </>
      }
      topic={chapter.topic}
    >
      {/* The client panel owns the instrument: narrate mode and the
          re-render pass are its view state, and the +1 buttons stay in the
          cards — they are the specimen, not controls (design.md §4). */}
      <StatePanel
        references={
          <ReferenceBar
            docsHref="https://react.dev/learn/state-a-components-memory"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/state"
          >
            <CodeBlock
              code={STATE_SOURCE}
              file="var-card.tsx + state-card.tsx"
            />
          </ReferenceBar>
        }
      />
    </DemoSection>
  );
}

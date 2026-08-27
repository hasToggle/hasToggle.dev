import { Suspense } from "react";
import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { parseRunId } from "./parse-run-id";
import { STREAM_SOURCE } from "./source";
import { Stage } from "./stage";
import { parseStrategy } from "./strategy";
import { StreamPanel } from "./stream-panel";

const chapter = requireChapter("streaming");

/** Both hosts of this exhibit read the same two params off the URL. */
export type StreamSearchParams = Promise<{ mode?: string; stream?: string }>;

interface StreamDemoProps {
  headingAs?: "h1" | "h2";
  searchParams: StreamSearchParams;
}

/**
 * Reads the arrangement and the run id off the URL — runtime data, which is
 * why it sits behind its own boundary — and hands the specimen to the panel
 * already rendered. A press rewrites both params, so the server genuinely
 * builds the page again with its boundaries somewhere else.
 */
async function StreamStage({
  searchParams,
}: {
  searchParams: StreamSearchParams;
}) {
  const { mode, stream } = await searchParams;
  return <Stage run={parseRunId(stream)} strategy={parseStrategy(mode)} />;
}

export function StreamDemo({ headingAs, searchParams }: StreamDemoProps) {
  return (
    <DemoSection
      belief={chapter.belief}
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            Not any more. The panel below is doing exactly what the title says —
            one <InlineCode>await</InlineCode>&#32;for all three, and nothing on
            screen until the slowest one is back. When the rows finally land,
            read the second number. The database query finished in 400 ms and
            arrived a second and a half later, with the other two, because it
            was made to wait on a legacy service it never called.
          </p>
          <p>
            The deck moves one thing: where the{" "}
            <InlineCode>&lt;Suspense&gt;</InlineCode>&#32;boundary sits. Add a
            fallback and the blank becomes a placeholder — that is all a{" "}
            <InlineCode>loading.tsx</InlineCode>&#32;is, and the rows still
            arrive together. Put a boundary around each part and each one leaves
            the server the moment it is ready. Nothing got faster. The legacy
            service still costs 1900 ms; the difference is that the other two
            stopped paying for it.
          </p>
          <p>
            The delays are hardcoded — the only faked thing on this page. The
            streaming is not: each row is a Server Component that genuinely
            finishes on the server, and every arrival time you read was
            measured, not written. Flip <InlineCode>response</InlineCode>&#32;in
            the corner to watch the same run the way the server sent it: one
            response, held open, one chunk per boundary.
          </p>
        </>
      }
      meta={
        <>
          We have never once profiled before adding a boundary. You put one
          where the spinner annoyed you, which works right up until you remember
          that the thing annoying you was your own laptop, three feet from the
          router. The row that most needs its own boundary is usually one you
          have never watched wait, because it is slow for somebody else.
        </>
      }
      navLabel={chapter.navLabel}
      topic={chapter.topic}
    >
      <StreamPanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/file-conventions/loading"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/stream"
          >
            <CodeBlock
              code={STREAM_SOURCE}
              file="stage.tsx · the three arrangements"
            />
          </ReferenceBar>
        }
      >
        <Suspense fallback={null}>
          <StreamStage searchParams={searchParams} />
        </Suspense>
      </StreamPanel>
    </DemoSection>
  );
}

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
            Not any more. The panel below is the version we all write first:
            three awaits at the top, one return at the bottom, and nothing on
            screen until the slowest of them is back. Watch it sit there. When
            the rows finally turn up, read the second number on each — the
            database query was finished in 400 ms and reached you a second and a
            half later, having waited on a legacy service it never called.
          </p>
          <p>
            Nothing in the deck makes the work shorter. The three calls stay the
            length they were; what moves is where the{" "}
            <InlineCode>&lt;Suspense&gt;</InlineCode>&#32;boundary sits around
            them. Give that boundary a fallback and the blank becomes a
            placeholder — the whole of what <InlineCode>loading.tsx</InlineCode>
            &#32;does — and the rows still arrive together, late, as a group.
            Give each row a boundary of its own and each one leaves the server
            the minute it is done. The legacy service still costs 1900 ms. It
            has stopped charging the other two for it.
          </p>
          <p>
            The delays are hardcoded — the only faked thing on this page, and
            here because there is nothing to watch in four milliseconds. The
            streaming is real: each row is a Server Component that finishes on
            the server, and every arrival time you read was measured there
            rather than written down. Flip <InlineCode>response</InlineCode>
            &#32;in the corner and the same run is redrawn the way the server
            sent it — one response, held open, a chunk per boundary.
          </p>
        </>
      }
      meta={
        <>
          We have never profiled anything before adding a boundary. You put one
          where the spinner annoyed you, and the spinner annoyed you on a laptop
          three feet from the router, with a warm cache and a database on
          localhost. The row that most needs a boundary of its own is usually
          one you have never watched wait, because it is slow in Sydney, on a
          phone, at six in the evening.
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

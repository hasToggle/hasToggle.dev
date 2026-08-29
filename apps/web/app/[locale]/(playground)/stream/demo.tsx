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
            You can. But it will be slow. The panel below is that page — the one
            we all write first, with all three calls awaited before the return
            and nothing on screen until the slowest of them is back. Give it a
            moment. When the rows arrive, read the second number: the database
            query was done in 400 ms and reached you a second and a half later,
            having waited on a legacy service it never called.
          </p>
          <p>
            One thing moves: where the <InlineCode>&lt;Suspense&gt;</InlineCode>
            &#32;boundary sits. Give it a fallback and the blank becomes a
            placeholder — all <InlineCode>loading.tsx</InlineCode>&#32;is — and
            the rows still arrive together, late, in a group. Give each row a
            boundary of its own and each leaves the server the second it is
            done. Nothing got faster. The legacy service still costs 1900 ms; it
            has stopped charging the other two for it.
          </p>
          <p>
            The delays are simulated. The streaming is real: each row is a
            Server Component that finishes on the server, and every arrival time
            you read was measured rather than written down. Flip{" "}
            <InlineCode>response</InlineCode>&#32;in the corner to see the same
            run as the server sent it — one response, held open, a chunk per
            boundary.
          </p>
        </>
      }
      meta={
        <>
          A boundary decides when work is shown, not when it begins. The three
          calls here start together — await them in a chain and each one waits
          for the ones before it, fast or slow.
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

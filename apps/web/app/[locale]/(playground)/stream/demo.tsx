import { Suspense } from "react";
import { chapterSourceHref, requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
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
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            It doesn&rsquo;t have to. The static shell ships first, and each
            slow part leaves a fallback in its place. When a part finishes on
            the server, its HTML streams down the same response and takes the
            fallback&rsquo;s place. The fast parts never wait for the slow ones,
            whatever they sit next to.
          </p>
          <p>
            The three rows below are slow on purpose, with their delays printed
            on them. Each one is a Server Component that finishes on the server
            and streams in when it is done. Await everything and nothing appears
            until the slowest is back. Add a fallback and a placeholder takes
            the blank&rsquo;s place, but the rows still arrive together. Wrap
            each part and the order holds: the shell, then the rows, fastest
            first. The response view shows the same run as the server sent it:
            one response, held open, a chunk per boundary.
          </p>
        </>
      }
      meta={
        <>
          A boundary decides when work is shown, not when it begins. The three
          calls here start together. Await them in a chain and each one waits
          for the ones before it, fast or slow.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
      topic={chapter.topic}
    >
      <StreamPanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/file-conventions/loading"
            sourceHref={chapterSourceHref(chapter)}
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

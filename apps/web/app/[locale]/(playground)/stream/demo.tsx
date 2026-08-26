import { Suspense } from "react";
import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { LivePanel } from "../live-panel";
import { ReferenceBar } from "../reference-bar";
import { RerunButton, RerunButtonFallback } from "./rerun-button";
import { STREAM_SOURCE } from "./source";
import { StreamRows, StreamRowsFallback } from "./stream-rows";

const chapter = requireChapter("streaming");

interface StreamDemoProps {
  headingAs?: "h1" | "h2";
  searchParams: Promise<{ stream?: string }>;
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
            Not any more. The static shell ships immediately, and each slow part
            leaves behind a fallback — the gray placeholder you&rsquo;ll watch
            below. As each part finishes, the server streams its finished HTML
            down the same response, and the placeholder gives way. The fast
            parts don&rsquo;t wait for the slow ones.
          </p>
          <p>
            These three rows are slow on purpose. The delays are hardcoded — the
            only faked thing on this page — but the streaming is not: each row
            is a Server Component that genuinely finishes on the server and
            lands when it is done. Run it again and watch the order hold. What
            you are seeing is the server finishing, not an animation pretending
            to.
          </p>
        </>
      }
      meta={
        <>
          loading.tsx is this same mechanism wearing route-sized clothes. One
          file, and the whole segment gets a fallback.
        </>
      }
      navLabel={chapter.navLabel}
      topic={chapter.topic}
    >
      {/* The rerun control keeps its own Suspense boundary (it reads the
          URL, which is runtime data) so the deck can hold it while the rows
          stream in the body — the rows' skeletons are the in-flight signal,
          arriving in delay order. */}
      <LivePanel
        deck={
          <Suspense fallback={<RerunButtonFallback />}>
            <RerunButton />
          </Suspense>
        }
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/file-conventions/loading"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/stream"
          >
            <CodeBlock code={STREAM_SOURCE} file="slow-row.tsx" />
          </ReferenceBar>
        }
      >
        <Suspense fallback={<StreamRowsFallback />}>
          <StreamRows searchParams={searchParams} />
        </Suspense>
      </LivePanel>
    </DemoSection>
  );
}

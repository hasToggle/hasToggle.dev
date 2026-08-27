import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { BoundaryPanel } from "./boundary-panel";
import { ServerCard } from "./server-card";
import { BOUNDARY_SOURCE } from "./source";

const chapter = requireChapter("boundary");

interface BoundaryDemoProps {
  headingAs?: "h1" | "h2";
}

export function BoundaryDemo({ headingAs }: BoundaryDemoProps) {
  return (
    <DemoSection
      belief={chapter.belief}
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            Safer than what? Every component in the App Router already runs on
            the server.{" "}
            <InlineCode>&quot;use client&quot;</InlineCode>&#32;is not a
            precaution, it&rsquo;s a purchase — for that file and everything it
            imports. You buy useState, useEffect and onClick. You pay with the
            database call you can no longer make from here, the API key you can
            no longer read, and however much React your visitor downloads on
            their phone.
          </p>
          <p>
            The card below is a Server Component — no directive, because that
            is the default. It fetched this repo&rsquo;s latest commit in
            Node.js and arrived as finished HTML; the component that made it is
            already gone. Use the deck to add a counter and the compiler
            refuses: the same error that sends everyone here, and it names its
            own fix. Apply the fix and the button works. The rows under the
            card say what it cost.
          </p>
        </>
      }
      meta={
        <>
          In a real app the counter gets its own small file, the directive goes
          there, and the page above it stays on the server.
        </>
      }
      navLabel={chapter.navLabel}
      topic={chapter.topic}
    >
      {/* The client panel owns the instrument: the beat is its view state,
          and the server card crosses into it as a finished slot — the
          composition the chapter teaches, load-bearing in its own frame. */}
      <BoundaryPanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/server-and-client-components"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/boundary"
          >
            <CodeBlock
              code={BOUNDARY_SOURCE}
              file="card.tsx · before and after"
            />
          </ReferenceBar>
        }
        serverCard={<ServerCard />}
      />
    </DemoSection>
  );
}

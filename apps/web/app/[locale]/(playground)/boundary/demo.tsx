import { chapterSourceHref, requireChapter } from "../../lab/syllabus";
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
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            They can, and most of yours already do. Every component in the App
            Router starts on the server, so it can call the API, read the
            database, hold the key, and finish its work before the page reaches
            your visitor. The browser gets the result, not the work.{" "}
            <InlineCode>&quot;use client&quot;</InlineCode>&#32;marks the one
            file that needs the browser, and that file is usually small.
          </p>
          <p>
            The component below fetched this repo&rsquo;s latest commit in
            Node.js and arrived as finished HTML. Add a copy button to the hash
            and watch where it lands: in its own file, inside its own line. The
            fetch never moves. The button is the only thing that ships.
          </p>
        </>
      }
      meta={
        <>
          Nothing in card.tsx got smaller. The fetch, the cache, the User-Agent
          header, the error path: all still there, all still in Node. The
          browser just got the JavaScript for a button.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
      topic={chapter.topic}
    >
      {/* The client panel owns the instrument: the beat is its view state,
          and the server card crosses into it as a finished slot — the
          composition the chapter teaches, load-bearing in its own frame. */}
      <BoundaryPanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/server-and-client-components"
            sourceHref={chapterSourceHref(chapter)}
            topic={chapter.topic}
          >
            <CodeBlock code={BOUNDARY_SOURCE} file="card.tsx · before, after" />
          </ReferenceBar>
        }
        serverCard={<ServerCard />}
        splitCard={<ServerCard withButton />}
      />
    </DemoSection>
  );
}

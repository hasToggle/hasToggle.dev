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
            Safer than what? We reached for it the same way, for about a year,
            before anyone made us say what it was protecting against. Every
            component in the App Router already runs on the server.{" "}
            <InlineCode>&quot;use client&quot;</InlineCode>&#32;is not a
            precaution, it&rsquo;s a purchase — for that file and everything it
            imports. You buy useState, useEffect and onClick. You pay with the
            database call you can no longer make from here, the API key you can
            no longer read, and however much React your visitor downloads on
            their phone.
          </p>
          <p>
            Below is one file, doing what every file does until someone says
            otherwise: it fetched this repo&rsquo;s latest commit, rendered on
            the server in Node.js, and arrived here as finished HTML — done
            before you got here. Ask it to count something (the deck walks you
            through it) and the build stops: the compiler refuses the render and
            names the one-line fix. Apply the fix, and the counter works. Then
            read the rows under the card, because that is where the price
            landed.
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

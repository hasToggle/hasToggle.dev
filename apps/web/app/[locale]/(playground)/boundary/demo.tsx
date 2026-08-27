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
            the server. <InlineCode>&quot;use client&quot;</InlineCode>&#32;is
            not a precaution, it&rsquo;s a purchase — for that file and
            everything it imports. You buy useState, useEffect and onClick. You
            pay with the database call you can no longer make from here, the API
            key you can no longer read, and however much React your visitor
            downloads on their phone.
          </p>
          <p>
            The card below is a Server Component — no directive, because that is
            the default. It fetched this repo&rsquo;s latest commit in Node.js
            and arrived as finished HTML; the component that made it is already
            gone. Use the deck to give the hash a copy button and the compiler
            refuses: the same error that sends everyone here, and it names its
            own fix. Apply that fix and the compiler refuses again — the
            directive claimed the whole file, and &quot;use cache&quot; has no
            client form. The second refusal names the real fix, a separate file.
            Take the third step and the button finally works.
          </p>
        </>
      }
      meta={
        <>
          The error offers two placements: the file, or its parent. The parent
          is how a page goes client by accident — the directive claims
          everything downstream of wherever it lands.
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
              file="card.tsx · start, crossed, split"
            />
          </ReferenceBar>
        }
        serverCard={<ServerCard />}
        splitCard={<ServerCard withButton />}
      />
    </DemoSection>
  );
}

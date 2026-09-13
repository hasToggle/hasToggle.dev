import { Suspense } from "react";
import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { MutationPanel } from "./mutation-panel";
import { PressCount, PressCountFallback } from "./press-count";
import { MUTATION_SOURCE } from "./source";

const chapter = requireChapter("server-actions");

interface MutationDemoProps {
  headingAs?: "h1" | "h2";
}

export function MutationDemo({ headingAs }: MutationDemoProps) {
  return (
    <DemoSection
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            It does now. A Server Action runs on the server and plugs straight
            into a form&rsquo;s <InlineCode>action</InlineCode>: no endpoint to
            design, no fetch to write, no JSON contract to keep in sync. Add one
            to the count and follow it: the form calls the function, the
            function writes the new count, and Next.js re-renders the page
            around it. That is the whole thing.
          </p>
          <p>
            The count lives in a cookie your browser carries but your JavaScript
            cannot open, which is what httpOnly means, and a Server Component
            reads it back. The value is safe from the tab that displays it,
            without a line written to arrange that.
          </p>
        </>
      }
      meta={
        <>
          Validating the request body, handling the 405, the fetch wrapper with
          a retry: forty lines of <InlineCode>/api/increment</InlineCode>, every
          time a number needed to go up. Multiply by every form you will ever
          build.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
      topic={chapter.topic}
    >
      {/* The client panel owns the form and the view switch; the count
          stays a Server Component and crosses in as a finished slot — the
          composition the boundary chapter teaches, load-bearing here. */}
      <MutationPanel
        count={
          <Suspense fallback={<PressCountFallback />}>
            <PressCount />
          </Suspense>
        }
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/updating-data"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/mutation"
          >
            <CodeBlock
              code={MUTATION_SOURCE}
              file="actions.ts + mutation-panel.tsx"
            />
          </ReferenceBar>
        }
      />
    </DemoSection>
  );
}

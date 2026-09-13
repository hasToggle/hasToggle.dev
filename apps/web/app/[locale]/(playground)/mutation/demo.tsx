import { Suspense } from "react";
import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { LivePanel } from "../live-panel";
import { ReferenceBar } from "../reference-bar";
import { PressCount, PressCountFallback } from "./press-count";
import { PressForm } from "./press-form";
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
            It does now. A Server Action lives on the server and plugs straight
            into a form&rsquo;s <InlineCode>action</InlineCode>: no endpoint to
            design, no fetch to write, no JSON contract to keep in sync. Press
            the button below and follow the trip — the form calls the function,
            the function adds one, and Next.js re-renders the page around the
            new number. That is the whole thing. There is no part you are
            missing.
          </p>
          <p>
            This one keeps its count in a cookie your browser carries but your
            JavaScript cannot open — that is what httpOnly means — and a Server
            Component reads it back. The value is safe from the tab that
            displays it, for free, without you writing a line to arrange it.
          </p>
        </>
      }
      meta={
        <>
          Think about what that frees up. Validating the request body, handling
          the 405, writing a fetch wrapper with a retry — that was forty lines
          of <InlineCode>/api/increment</InlineCode>, every time a number needed
          to go up. Multiply it by every form you will ever build.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
      topic={chapter.topic}
    >
      {/* The form stays in the body: it is the specimen, not instrument
          chrome — a form wired straight to a Server Action is the entire
          lesson, and moving it into the deck would file the exhibit's
          subject under controls. */}
      <LivePanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/updating-data"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/mutation"
          >
            <CodeBlock
              code={MUTATION_SOURCE}
              file="actions.ts + press-form.tsx"
            />
          </ReferenceBar>
        }
      >
        <div className="flex flex-col gap-6">
          <Suspense fallback={<PressCountFallback />}>
            <PressCount />
          </Suspense>
          <PressForm />
        </div>
      </LivePanel>
    </DemoSection>
  );
}

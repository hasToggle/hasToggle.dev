import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { LivePanel } from "../live-panel";
import { ReferenceBar } from "../reference-bar";
import { ClientCard } from "./client-card";
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
            Watch the two cards below. One rendered in Node.js and arrived as
            finished HTML — done before you got here. The other arrived as
            JavaScript and woke up in your tab — the waking is called hydration
            — and its button is waiting for a click. Only one of them is running
            Node, and it prints the version to prove it.
          </p>
        </>
      }
      meta={
        <>
          The error that sends everyone here is &ldquo;useState only works in a
          Client Component&rdquo;. The server isn&rsquo;t being difficult. It
          has no clicks to listen for.
        </>
      }
      navLabel={chapter.navLabel}
      topic={chapter.topic}
    >
      <LivePanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/server-and-client-components"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/boundary"
          >
            <CodeBlock
              code={BOUNDARY_SOURCE}
              file="server-card.tsx + client-card.tsx"
            />
          </ReferenceBar>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ServerCard />
            <ClientCard />
          </div>
          {/* The seam, narrated: the one fact neither card can state alone. */}
          <p className="font-mono text-muted-foreground text-xs/5">
            props cross the boundary as serialized data — the import graph
            decides which side a component runs on.
          </p>
        </div>
      </LivePanel>
    </DemoSection>
  );
}

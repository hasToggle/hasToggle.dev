import { requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { OgDemo } from "./og-demo";
import { OG_SOURCE } from "./source";

const chapter = requireChapter("og-images");

interface ImageDemoProps {
  headingAs?: "h1" | "h2";
}

export function ImageDemo({ headingAs }: ImageDemoProps) {
  return (
    <DemoSection
      belief={chapter.belief}
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            You&rsquo;ll design one. <InlineCode>ImageResponse</InlineCode>
            &#32;turns JSX — the same markup your components are made of — into
            a PNG the moment a request asks, and it is a route handler like any
            other: query in, image out. One file draws the card for every page
            you will ever publish.
          </p>
          <p>
            Type a title and the server draws it. The same endpoint drew the
            link preview for this page — paste the URL into Slack and check us
            against it.
          </p>
        </>
      }
      meta={
        <>
          Every repo has an og-image-final-v2.png in it somewhere, quietly out
          of date since the last time the headline changed. Nobody is coming to
          update it, and now nobody has to.
        </>
      }
      navLabel={chapter.navLabel}
      topic={chapter.topic}
    >
      {/* OgDemo owns the instrument: the gauge follows its fetch state, the
          title form is its deck. The reference bar threads through as a prop
          because CodeBlock renders on the server. */}
      <OgDemo
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/functions/image-response"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/api/og"
          >
            <CodeBlock code={OG_SOURCE} file="app/api/og/route.tsx" />
          </ReferenceBar>
        }
      />
    </DemoSection>
  );
}

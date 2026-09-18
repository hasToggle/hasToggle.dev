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
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            Every page you have published, and every page you have not written
            yet. <InlineCode>ImageResponse</InlineCode>&#32;turns JSX, the same
            markup your components are made of, into a PNG at the moment a
            request asks for it. It runs in a Route Handler like any other:
            query in, image out.
          </p>
          <p>
            Pick a page and the server draws its card. The same route drew the
            link preview for this page. Paste this page&rsquo;s URL into Slack
            and compare.
          </p>
        </>
      }
      meta={
        <>
          Every repo has an og-image-final-v2.png in it somewhere, out of date
          since the last time the headline changed. That file just became
          something you never have to think about again.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
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
            topic={chapter.topic}
          >
            <CodeBlock code={OG_SOURCE} file="app/api/og/route.tsx" />
          </ReferenceBar>
        }
      />
    </DemoSection>
  );
}

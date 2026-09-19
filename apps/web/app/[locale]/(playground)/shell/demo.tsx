import { chapterSourceHref, requireChapter } from "../../lab/syllabus";
import { CodeBlock } from "../code-block";
import { DemoSection } from "../demo-section";
import { InlineCode } from "../inline-code";
import { ReferenceBar } from "../reference-bar";
import { getBake } from "./bake";
import { BakedStamp } from "./baked-stamp";
import { RebakePanel } from "./rebake-panel";
import { SHELL_SOURCE } from "./source";

const chapter = requireChapter("caching");

interface ShellDemoProps {
  headingAs?: "h1" | "h2";
}

export async function ShellDemo({ headingAs }: ShellDemoProps) {
  const bake = await getBake();

  return (
    <DemoSection
      headingAs={headingAs}
      id={`demo-${chapter.slug}`}
      intro={
        <>
          <p>
            That used to be a contradiction. <InlineCode>use cache</InlineCode>
            &#32;renders a component once and keeps the output as a cache entry
            that every visitor gets. That is the static half. A cache tag is the
            handle on that entry: pull it and the entry expires, for everyone,
            at once. That is the up-to-date half. Nothing renders a replacement
            until someone asks for the page, and everyone after them gets the
            fresh entry free.
          </p>
          <p>
            The stamp below is this page&rsquo;s own entry, wearing a
            six-character fingerprint so you can tell one render from the next.
            Revalidate it and a fresh one reaches every reader of this page in
            about the time it takes the label to change back. It feels like one
            event.
          </p>
          <p>
            It is three, and slow motion shows you each of them. Expire the
            entry, then ask for the page, and watch the color: it changes twice,
            not once. The gap between the two is what your cache logs have been
            naming all along. The request that refills the entry logs{" "}
            <InlineCode>REVALIDATED</InlineCode>, reason{" "}
            <InlineCode>tag-based deletion</InlineCode>, because that request
            did the rendering. <InlineCode>STALE</InlineCode> is the same gap
            handled softly: the old entry served while a fresh one renders.
          </p>
        </>
      }
      meta={
        <>
          In your app, the two renders behind one press would read the same
          database and agree, and no visitor would ever see the seam. The entry
          here is a random color precisely so two renders can never agree. A
          cache can only be watched working on something that never repeats. The{" "}
          <InlineCode>remote</InlineCode> in the directive is the same honesty:
          plain <InlineCode>use cache</InlineCode> is the memory of whichever
          server rendered it, and the contents page, rendering on another, was
          baking a second entry of its own. Remote is one entry, and every page
          that reads it shows the same color.
        </>
      }
      navLabel={chapter.navLabel}
      title={chapter.title}
      topic={chapter.topic}
    >
      {/* The client panel owns the instrument chrome here, because the
          header gauge and the display's pending treatment follow its
          transitions. The stamp stays a Server Component, threaded through
          as a prop — the composition exhibit one teaches. No label (the
          intro names the subject once) and no readout strip: cacheTag and
          cacheLife are visible in the bake.ts source, one drawer down in
          the reference bar, which is the spec plate a reader who wants
          identifiers actually opens. */}
      <RebakePanel
        currentId={bake.id}
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/caching"
            sourceHref={chapterSourceHref(chapter)}
            topic={chapter.topic}
          >
            <CodeBlock
              code={SHELL_SOURCE}
              file="bake.ts + actions.ts + the ask"
            />
          </ReferenceBar>
        }
        stamp={<BakedStamp bake={bake} />}
      />
    </DemoSection>
  );
}

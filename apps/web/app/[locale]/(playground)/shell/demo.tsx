import { requireChapter } from "../../lab/syllabus";
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
      belief={chapter.belief}
      chapter={chapter.n}
      headingAs={headingAs}
      id={`demo-${chapter.n}`}
      intro={
        <>
          <p>
            We believed it, too — hit or miss, there or not. But
            &ldquo;cached&rdquo; is not a state a page is in; it is a bake with
            a lifespan. <InlineCode>use cache</InlineCode>&#32;bakes a
            component&rsquo;s output into the page&rsquo;s static shell — one
            copy, served to everyone — and a cache tag is the handle you pull to
            throw that copy away. Pulling it empties the shelf and lights no
            oven. The fresh page is baked when the next request asks for one,
            and not a moment before.
          </p>
          <p>
            The stamp below is that copy — this page&rsquo;s own cache entry,
            wearing a six-character fingerprint so you can tell one bake from
            the next. Press the button and a fresh bake lands for every visitor,
            in the time it takes the label to change back. It feels like one
            event.
          </p>
          <p>
            It is three. Flip the switch and run it again in slow motion — the
            panel narrates each event as it happens. Watch the color: it changes
            twice, not once, and that gap is what your cache logs are naming.
            Press the button here and the next request logs{" "}
            <InlineCode>REVALIDATED</InlineCode> — reason:{" "}
            <InlineCode>tag-based deletion</InlineCode> — because that request
            was the refill. <InlineCode>STALE</InlineCode> is the same gap
            handled softly: the old bake served while a fresh one is in the
            oven.
          </p>
        </>
      }
      meta={
        <>
          In your app, the two renders behind one press would read the same
          database and agree — no visitor would ever see the seam. The bake here
          is a random color value precisely so two renders can never agree.
          Watching a cache work requires caching something that never repeats.
        </>
      }
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
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/shell"
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

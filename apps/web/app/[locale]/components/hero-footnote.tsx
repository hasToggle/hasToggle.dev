/** The Next.js major the site actually runs on, guarded by hero-footnote.test.ts. */
export const NEXT_MAJOR = "16";

/**
 * The body of the hero asterisk's footnote: the marker and the text, with no
 * wrapper of its own.
 *
 * It hangs off the eyebrow, not the headline — the eyebrow names Next.js and
 * Vercel, and this is the readout that says which Next.js and whose Vercel.
 * A version number is normally the kind of line voice.md §7 warns about, so
 * the major is a named constant and a test fails the build the day the
 * installed version moves past it.
 *
 * It renders twice — in the desktop hover card (`hero-asterisk.tsx`) and in the
 * mobile block below the contents list (`hero.tsx`) — but the two wrappers
 * differ, so only the shared inside lives here. It was duplicated verbatim
 * until nothing but hand-checking kept the copies in sync.
 */
export function HeroFootnoteBody() {
  return (
    <>
      <span aria-hidden="true" className="select-none opacity-70">
        *&nbsp;
      </span>
      {`runs on next.js ${NEXT_MAJOR} · deployed on vercel · everything open source`}
    </>
  );
}

/**
 * The body of the hero asterisk's footnote: the marker and the text, with no
 * wrapper of its own.
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
      You&rsquo;ve opened a &ldquo;live demo&rdquo; that turned out to be an
      animated GIF. So have we. The demos below answer back, and the code that
      made them is one click down.
    </>
  );
}

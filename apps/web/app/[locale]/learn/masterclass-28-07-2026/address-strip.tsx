/** The talk's short URL, shown permanently because the page is presented
 *  without browser chrome and latecomers need something they can type. */
const SHORT_URL_HOST = "hastoggle.dev";
const SHORT_URL_PATH = "/live";
const MASTERCLASS_DATE = "2026-07-28";

export function AddressStrip() {
  return (
    <div className="border-foreground/10 border-b bg-foreground/[0.03]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-1.5">
        <a
          className="rounded font-mono text-sm tracking-wide focus-visible:bg-foreground/10 focus-visible:outline-hidden"
          href={SHORT_URL_PATH}
        >
          <span className="text-foreground/50">{SHORT_URL_HOST}</span>
          <span className="text-foreground/90">{SHORT_URL_PATH}</span>
        </a>
        <span className="hidden font-mono text-foreground/40 text-sm tracking-wide sm:block">
          {MASTERCLASS_DATE}
        </span>
      </div>
    </div>
  );
}

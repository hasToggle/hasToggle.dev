"use client";

import { useEffect, useState } from "react";

/**
 * The navigation chapter's reading, running before the chapter does: the
 * lab's own contents rows are prefetched by next/link as they scroll into
 * view, so the instrument is the site's own chrome caught doing the thing
 * the chapter will be about.
 *
 * What it counts is real and per-visitor: RSC payload fetches, which is
 * what a prefetch is. Every App Router prefetch appends `_rsc=` to the
 * route it is fetching, so the resource timeline is the instrument — no
 * hooks into the router, nothing the page has to be told.
 *
 * Counted by route, not by request: this build fetches a small shell and
 * then the segment, so five links produce ten entries and a row claiming
 * "10 routes" would be the index's first lie. Bytes are summed across
 * every request, because that is what the visitor actually paid.
 *
 * Prefetching is disabled in `next dev`, so this reads zero there and only
 * tells the truth against a production build. And the trigger is the
 * viewport, not the pointer — the rows prefetch as they scroll past,
 * before anyone hovers anything, which is why the label says nothing
 * about hovering.
 */
export function NavigationIndexValue() {
  const [reading, setReading] = useState({ bytes: 0, routes: 0 });

  useEffect(() => {
    const routes = new Set<string>();
    const requests = new Set<string>();
    let bytes = 0;

    const take = (entries: PerformanceEntryList) => {
      for (const entry of entries) {
        if (!entry.name.includes("_rsc=") || requests.has(entry.name)) {
          continue;
        }
        requests.add(entry.name);
        routes.add(new URL(entry.name).pathname);
        bytes += (entry as PerformanceResourceTiming).transferSize;
      }
      setReading({ bytes, routes: routes.size });
    };

    const observer = new PerformanceObserver((list) => take(list.getEntries()));
    observer.observe({ buffered: true, type: "resource" });

    return () => observer.disconnect();
  }, []);

  return (
    <span>
      prefetched for you ·{" "}
      <span className="tabular-nums">{reading.routes}</span>
      {reading.routes === 1 ? " route" : " routes"}
      {reading.bytes > 0 ? (
        <>
          {" · "}
          <span className="tabular-nums">
            {(reading.bytes / 1024).toFixed(1)}
          </span>
          {" kB"}
        </>
      ) : null}
    </span>
  );
}

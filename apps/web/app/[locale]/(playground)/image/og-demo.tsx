"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Label } from "@repo/design-system/components/ui/label";
import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_OG_TITLE, OG_TITLES } from "@/app/api/og/title";
import { LivePanel } from "../live-panel";

interface GeneratedImage {
  bytes: number;
  type: string;
  url: string;
}

interface OgDemoProps {
  /** The instrument's reference bar — code drawer plus docs/source links. */
  references?: React.ReactNode;
}

const BYTES_PER_KB = 1024;

function formatKb(bytes: number): string {
  return `${(bytes / BYTES_PER_KB).toFixed(1)} kB`;
}

/**
 * The image chapter's instrument. Picks a page, requests `/api/og?title=…`,
 * shows the PNG the server just rendered — on an image-viewer checkerboard,
 * with the file's own facts read from the response. The interesting part is
 * the URL: it's a plain GET endpoint, so the link opens the same file the
 * crawlers see. The pick is a select rather than a text field because the
 * route only draws the site's own titles (see api/og/title.ts).
 *
 * Owns the panel chrome because the gauge follows its fetch state: the form
 * is the deck, the PNG is the specimen, and the pipeline facts (including
 * Satori's flexbox limit) are the narration line.
 */
export function OgDemo({ references }: OgDemoProps) {
  const [draft, setDraft] = useState(DEFAULT_OG_TITLE);
  const [title, setTitle] = useState(DEFAULT_OG_TITLE);
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shownUrl = useRef<string | null>(null);
  // Explicit `| null`, matching `shownUrl` above: without it biome types
  // `.current` as always-present and flags the mount guard as dead code.
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);

  const endpoint = `/api/og?title=${encodeURIComponent(title)}`;

  /*
   * The PNG this demo asks for is about 60 kB, and this exhibit sits a long
   * way down the page. Fetching on mount meant every visitor paid for it
   * during the initial load — competing for bandwidth with the bytes the
   * first screen actually needed — whether or not they ever scrolled this
   * far. Arm on approach instead; from that point the demo behaves exactly
   * as it did, including on every later re-generate.
   */
  useEffect(() => {
    const node = panelRef.current;

    // `=== null`, not truthiness — same biome quirk as `shownUrl` above.
    if (node === null) {
      return;
    }

    // No observer (very old browsers, some test environments): keep the old
    // eager behaviour rather than leaving the panel stuck on its skeleton.
    if (typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      // Start a little before it lands, so the image is usually there by the
      // time the panel is actually read.
      { rootMargin: "300px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`the server said ${response.status}`);
        }
        const blob = await response.blob();
        if (cancelled) {
          return;
        }
        const url = URL.createObjectURL(blob);
        setImage((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous.url);
          }
          return { bytes: blob.size, type: blob.type || "image/png", url };
        });
        shownUrl.current = url;
      })
      .catch(() => {
        if (!cancelled) {
          setError("The server couldn’t draw that one. Try another page.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, armed]);

  useEffect(
    () => () => {
      // `!== null`, not truthiness: biome reads `useRef(null).current` as
      // always-null from the initializer and flags the shorter form.
      if (shownUrl.current !== null) {
        URL.revokeObjectURL(shownUrl.current);
      }
    },
    []
  );

  const generate = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTitle(draft);
    },
    [draft]
  );

  const handleDraftChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDraft(event.target.value);
    },
    []
  );

  const deck = (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={generate}>
      <div className="flex-1">
        <Label className="sr-only" htmlFor="og-title">
          Page to draw the card for
        </Label>
        <select
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          id="og-title"
          name="title"
          onChange={handleDraftChange}
          value={draft}
        >
          {OG_TITLES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button className="h-11 px-6" disabled={loading} type="submit">
        {loading ? "Rendering…" : "Generate the image"}
      </Button>
    </form>
  );

  return (
    <LivePanel
      deck={deck}
      references={references}
      status={loading ? "working" : "live"}
    >
      <div className="flex flex-col gap-4" ref={panelRef}>
        <p className="truncate font-mono text-muted-foreground text-xs">
          GET {endpoint}
        </p>
        <div className="og-checker rounded-xl border border-foreground/10 p-4 sm:p-6">
          <div className="relative overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10">
            {image ? (
              /* Plain <img> with the blob we just fetched — wrapping a
               generated PNG in next/image would optimize it twice. */
              // biome-ignore lint/performance/noImgElement: the demo shows the raw route handler output
              <img
                alt={`Open Graph card generated from the title: ${title}`}
                className={cn(
                  "block aspect-[1200/630] w-full transition-opacity duration-300",
                  loading && "opacity-40"
                )}
                height={630}
                src={image.url}
                width={1200}
              />
            ) : (
              <div className="flex aspect-[1200/630] w-full items-center justify-center bg-background/60">
                <span className="font-mono text-muted-foreground text-xs">
                  {error ?? "rendering on the server…"}
                </span>
              </div>
            )}
            {loading && image ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-background/80 px-4 py-1.5 font-mono text-muted-foreground text-xs">
                  rendering…
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-muted-foreground text-xs">
          <span>
            {error ??
              (image
                ? `og.png · 1200 × 630 · ${image.type} · ${formatKb(image.bytes)}`
                : "og.png · 1200 × 630")}
          </span>
          <a
            className="text-ht-cyan-800/85 transition-colors hover:text-ht-cyan-700 dark:text-ht-cyan-300/85 dark:hover:text-ht-cyan-200"
            href={endpoint}
            rel="noreferrer"
            target="_blank"
          >
            open the file ↗
          </a>
        </div>
        {/* The seam: the one fact per clause this instrument proves.
            Implementation limits live here, where they read as
            specification. */}
        <p className="font-mono text-muted-foreground text-xs/5">
          one Route Handler · JSX in, PNG out · drawn per request, flexbox only
        </p>
      </div>
    </LivePanel>
  );
}

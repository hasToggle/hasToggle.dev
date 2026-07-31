"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";
import { DEFAULT_OG_TITLE } from "@/app/api/og/title";

/**
 * Types a title, requests `/api/og?title=…`, shows the PNG the server just
 * invented. The interesting part is in the URL readout: it's a plain GET
 * endpoint — share the link and the image regenerates for whoever opens it.
 */
export function OgDemo() {
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState(DEFAULT_OG_TITLE);
  const [loading, setLoading] = useState(false);

  const src = `/api/og?title=${encodeURIComponent(title)}`;

  const generate = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = draft.trim() || DEFAULT_OG_TITLE;
    if (next !== title) {
      setTitle(next);
      setLoading(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={generate}>
        <div className="flex-1">
          <Label className="sr-only" htmlFor="og-title">
            Title for the generated image
          </Label>
          <Input
            className="h-11"
            id="og-title"
            maxLength={120}
            name="title"
            onChange={(event) => setDraft(event.target.value)}
            placeholder={DEFAULT_OG_TITLE}
            type="text"
            value={draft}
          />
        </div>
        <Button className="h-11 px-6" disabled={loading} type="submit">
          {loading ? "Rendering…" : "Generate the image"}
        </Button>
      </form>
      <p className="truncate font-mono text-muted-foreground text-xs">
        GET /api/og?title={encodeURIComponent(title)}
      </p>
      <div className="relative overflow-hidden rounded-lg border border-foreground/10">
        {/* Plain <img>, on purpose: the endpoint *is* the image pipeline, and
            wrapping a generated PNG in next/image would optimize it twice. */}
        {/* biome-ignore lint/performance/noImgElement: the demo shows the raw route handler output */}
        <img
          alt={`Open Graph card generated from the title: ${title}`}
          className={cn(
            "aspect-[1200/630] w-full transition-opacity duration-300",
            loading && "opacity-40"
          )}
          height={630}
          key={src}
          onError={() => setLoading(false)}
          onLoad={() => setLoading(false)}
          src={src}
          width={1200}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-background/80 px-4 py-1.5 font-mono text-muted-foreground text-xs">
              satori is drawing…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

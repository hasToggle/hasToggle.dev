"use client";

import { useEffect, useState } from "react";
import { formatStamp } from "../format";
import { InlineCode } from "../inline-code";
import { CopyButton } from "./copy-button";

interface FetchedCommit {
  sha: string;
  stamp: string;
  subject: string;
}

type FetchState =
  | { commit: FetchedCommit; phase: "done" }
  | { phase: "failed" }
  | { phase: "loading" };

/**
 * The hydrated beat's body: the same card after the directive claimed the
 * whole file. The copy button works — that was the purchase — and the
 * fetch now runs here too, because it had nowhere else to go: the reading
 * arrives after hydration, from this visitor's connection, against
 * GitHub's per-IP rate limit, cached for nobody. Every state this
 * component shows is the real request's.
 */
export function ClientCard() {
  const [state, setState] = useState<FetchState>({ phase: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/hasToggle/hasToggle.dev/commits/main", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        return response.json();
      })
      .then(
        (data: {
          commit: { committer: { date: string }; message: string };
          sha: string;
        }) => {
          setState({
            commit: {
              sha: data.sha.slice(0, 7),
              stamp: formatStamp(new Date(data.commit.committer.date)),
              subject: data.commit.message.split("\n")[0],
            },
            phase: "done",
          });
        }
      )
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ phase: "failed" });
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display font-medium text-2xl text-foreground tracking-tight">
        <span>
          latest commit{" "}
          <span className="font-mono text-ht-orange-800 text-xl dark:text-ht-orange-300">
            {state.phase === "done" ? state.commit.sha : "·······"}
          </span>
        </span>
        {state.phase === "done" ? (
          <CopyButton value={state.commit.sha} />
        ) : null}
      </p>
      {state.phase === "done" ? (
        <p className="flex items-baseline gap-2 font-mono text-muted-foreground text-xs">
          <span className="min-w-0 truncate">{state.commit.subject}</span>
          <span aria-hidden="true" className="shrink-0 opacity-55">
            ·
          </span>
          <span className="shrink-0">{state.commit.stamp}</span>
        </p>
      ) : (
        <p
          className={
            state.phase === "loading"
              ? "font-mono text-muted-foreground text-xs motion-safe:animate-pulse"
              : "font-mono text-muted-foreground text-xs"
          }
        >
          {state.phase === "loading"
            ? "fetching from your tab…"
            : "github declined this tab’s request — the rate limit is per visitor now"}
        </p>
      )}
      <p className="text-foreground/75 text-sm/6">
        Fetched from <InlineCode>api.github.com</InlineCode>&#32;in your
        browser, after hydration — <InlineCode>process</InlineCode>&#32;is not
        defined here, and this request was yours alone: nothing cached, nothing
        shared.
      </p>
    </div>
  );
}

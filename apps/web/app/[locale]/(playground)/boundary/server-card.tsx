import { cacheLife } from "next/cache";
import { formatClock, formatStamp } from "../format";
import { InlineCode } from "../inline-code";
import { CopyButton } from "./copy-button";

interface LatestCommit {
  sha: string;
  stamp: string;
  subject: string;
}

interface ServerFacts {
  commit: LatestCommit | null;
  nodeVersion: string;
  renderedAt: string;
}

/**
 * The work developers expect from a Server Component: fetch something and
 * render it. The something is this repo's own latest commit — data the
 * making-of aside already trades in. Drift is accepted and disclosed on
 * the card: `hours` revalidates the entry hourly, and a commit that lands
 * inside the window ships with the deploy it triggers anyway, so the
 * stale reading rarely outlives the push that obsoleted it (2026-08-27).
 * One refetch an hour also keeps GitHub's unauthenticated rate limit
 * (60/hour per IP) out of the picture entirely.
 */
async function getServerFacts(): Promise<ServerFacts> {
  "use cache";
  cacheLife("hours");

  let commit: LatestCommit | null = null;
  try {
    const response = await fetch(
      "https://api.github.com/repos/hasToggle/hasToggle.dev/commits/main",
      // GitHub rejects requests without a User-Agent.
      { headers: { "user-agent": "hasToggle.dev" } }
    );
    if (response.ok) {
      const data = (await response.json()) as {
        commit: { committer: { date: string }; message: string };
        sha: string;
      };
      commit = {
        sha: data.sha.slice(0, 7),
        stamp: formatStamp(new Date(data.commit.committer.date)),
        subject: data.commit.message.split("\n")[0],
      };
    }
  } catch {
    // GitHub unreachable when the entry renders: fall back to residence
    // facts alone rather than caching an invented reading.
  }

  return {
    commit,
    nodeVersion: process.version,
    renderedAt: new Date().toISOString(),
  };
}

interface ServerCardProps {
  /**
   * The split beat: this Server Component imports copy-button.tsx — a
   * Client Component — which is the split's whole mechanism, running for
   * real. The island renders inside a drawn boundary: the dashed ring is
   * the import graph's line, at its smallest.
   */
  withButton?: boolean;
}

/**
 * The rest and split beats' body: a Server Component, rendered in Node
 * and passed through the client panel as a finished slot — props crossing
 * the boundary as serialized data, which is the chapter's own mechanism.
 * `process.version` is proof of residence: browsers don't have one.
 */
export async function ServerCard({ withButton }: ServerCardProps) {
  const facts = await getServerFacts();

  return (
    <div className="flex flex-col gap-2">
      {facts.commit ? (
        <>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display font-medium text-2xl text-foreground tracking-tight">
            <span>
              latest commit{" "}
              <span className="font-mono text-ht-cyan-700 text-xl dark:text-ht-cyan-300">
                {facts.commit.sha}
              </span>
            </span>
            {withButton ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-ht-orange-700/40 border-dashed px-1.5 py-1 dark:border-ht-orange-500/40">
                <CopyButton value={facts.commit.sha} />
                <span className="font-mono text-[0.65rem] text-ht-orange-800 dark:text-ht-orange-300">
                  copy-button.tsx
                </span>
              </span>
            ) : null}
          </p>
          {/* The subject may be a full merge line; it truncates so the
              stamp — the checkable half — never does. */}
          <p className="flex items-baseline gap-2 font-mono text-muted-foreground text-xs">
            <span className="min-w-0 truncate">{facts.commit.subject}</span>
            <span aria-hidden="true" className="shrink-0 opacity-55">
              ·
            </span>
            <span className="shrink-0">{facts.commit.stamp}</span>
          </p>
        </>
      ) : (
        <p className="font-display font-medium text-2xl text-foreground tracking-tight">
          Rendered in Node.js{" "}
          <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
            {facts.nodeVersion}
          </span>
        </p>
      )}
      <p className="text-foreground/75 text-sm/6">
        {facts.commit ? (
          <>
            Fetched from <InlineCode>api.github.com</InlineCode>&#32;in{" "}
            <InlineCode>node {facts.nodeVersion}</InlineCode>&#32;at&#32;
            {formatClock(new Date(facts.renderedAt))}, then cached — re-served
            to every visitor until the entry revalidates or a deploy replaces
            it.
          </>
        ) : (
          <>
            at {formatClock(new Date(facts.renderedAt))}, then cached —
            re-served to every visitor until the entry revalidates or a deploy
            replaces it.
          </>
        )}
      </p>
    </div>
  );
}

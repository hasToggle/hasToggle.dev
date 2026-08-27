import { cacheLife } from "next/cache";
import { formatStamp } from "../format";

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
 * the card: the entry re-bakes every few minutes, so a commit that lands
 * between bakes serves stale for at most that window (approved
 * 2026-08-27). GitHub's unauthenticated rate limit is 60/hour per IP;
 * at one refetch per ~3 minutes the bake stays well under it.
 */
async function getServerFacts(): Promise<ServerFacts> {
  "use cache";
  cacheLife({ expire: 3600, revalidate: 180, stale: 180 });

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
    // GitHub unreachable at bake time: the card falls back to residence
    // facts alone rather than caching an invented reading.
  }

  return {
    commit,
    nodeVersion: process.version,
    renderedAt: new Date().toISOString(),
  };
}

/**
 * The rest beat's body: a Server Component, rendered in Node and passed
 * through the client panel as a finished slot — props crossing the
 * boundary as serialized data, which is the chapter's own mechanism.
 * `process.version` is proof of residence: browsers don't have one.
 */
export async function ServerCard() {
  const facts = await getServerFacts();

  return (
    <div className="flex flex-col gap-2">
      {facts.commit ? (
        <>
          <p className="font-display font-medium text-2xl text-foreground tracking-tight">
            latest commit{" "}
            <span className="font-mono text-ht-cyan-700 text-xl dark:text-ht-cyan-300">
              {facts.commit.sha}
            </span>
          </p>
          <p className="truncate font-mono text-muted-foreground text-xs">
            {facts.commit.subject} · {facts.commit.stamp}
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
        {facts.commit
          ? `Fetched from api.github.com in Node.js ${facts.nodeVersion}, at `
          : "at "}
        {formatStamp(new Date(facts.renderedAt))}, then cached — re-served to
        every visitor until the next bake, a few minutes from now.
      </p>
    </div>
  );
}

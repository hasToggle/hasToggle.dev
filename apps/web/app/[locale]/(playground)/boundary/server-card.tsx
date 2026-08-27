import { cacheLife } from "next/cache";
import { formatStamp } from "../format";

interface ServerFacts {
  nodeVersion: string;
  renderedAt: string;
}

// biome-ignore lint/suspicious/useAwait: `use cache` only works on async functions, even when nothing awaits
async function getServerFacts(): Promise<ServerFacts> {
  "use cache";
  cacheLife("hours");
  return {
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
      <p className="font-display font-medium text-2xl text-foreground tracking-tight">
        Rendered in Node.js{" "}
        <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
          {facts.nodeVersion}
        </span>
      </p>
      <p className="text-foreground/75 text-sm/6">
        at {formatStamp(new Date(facts.renderedAt))}, then cached. Refresh the
        page — this card doesn&rsquo;t re-render, it gets re-served.
      </p>
    </div>
  );
}

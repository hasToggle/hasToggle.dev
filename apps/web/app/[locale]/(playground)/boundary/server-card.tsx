import { cacheLife } from "next/cache";
import { formatStamp } from "../format";
import { BoundaryCard } from "./card";

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
 * A Server Component. It ran on the server, its output was cached into the
 * page, and your browser received finished HTML — no JavaScript attached.
 * `process.version` is here as proof of residence: browsers don't have one.
 */
export async function ServerCard() {
  const facts = await getServerFacts();

  return (
    <BoundaryCard
      facts={[
        "can query databases, read secrets",
        "ships 0 kB of JavaScript",
        "cannot use state or onClick",
      ]}
      side="server"
      title="server-card.tsx"
    >
      <div className="flex flex-col gap-2">
        <p className="font-display font-medium text-2xl text-foreground tracking-tight">
          Rendered in Node.js{" "}
          <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
            {facts.nodeVersion}
          </span>
        </p>
        <p className="text-foreground/75 text-sm/6">
          at {formatStamp(new Date(facts.renderedAt))}, then cached. Refresh the
          page — this card doesn&apos;t re-render, it gets re-served.
        </p>
      </div>
    </BoundaryCard>
  );
}

import { cookies } from "next/headers";
import { COUNT_COOKIE, parseCount } from "./count-parser";

/**
 * A Server Component reading request data (your cookie), which is why the
 * page keeps it behind Suspense — it can't be baked into the shell, because
 * the shell is shared and your press count, tragically, is yours.
 */
export async function PressCount() {
  const jar = await cookies();
  const count = parseCount(jar.get(COUNT_COOKIE)?.value);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-display font-medium text-4xl text-foreground tabular-nums tracking-tight sm:text-5xl">
        {count}
        <span className="ml-3 font-normal text-lg text-muted-foreground tracking-normal">
          {count === 1 ? "press" : "presses"}
        </span>
      </p>
      <p className="font-mono text-muted-foreground text-xs/5">
        read server-side from an httpOnly cookie — your JavaScript can&apos;t
        even see it
      </p>
    </div>
  );
}

export function PressCountFallback() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-10 items-center sm:h-12">
        <div className="h-8 w-24 rounded bg-foreground/10 motion-safe:animate-pulse" />
      </div>
      <p className="font-mono text-muted-foreground/60 text-xs/5">
        asking the server for your cookie…
      </p>
    </div>
  );
}

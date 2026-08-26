interface RowSkeletonProps {
  delayMs: number;
}

/**
 * What a Suspense fallback is: the honest placeholder the shell ships while
 * the server finishes. Same height as the real row, so nothing jumps.
 */
export function RowSkeleton({ delayMs }: RowSkeletonProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-lg border border-foreground/10 bg-muted/30 px-4 py-3">
      <div className="h-5 w-40 max-w-full rounded bg-foreground/10 motion-safe:animate-pulse" />
      <p className="whitespace-nowrap font-mono text-muted-foreground text-xs">
        cooking (~{delayMs} ms)
      </p>
    </div>
  );
}

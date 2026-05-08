export function TestDiff() {
  return (
    <div className="space-y-3">
      <p className="font-medium font-mono text-[0.65rem] text-ht-cyan-700 uppercase tracking-[0.2em] dark:text-ht-cyan-300/90">
        What the agent did when the test failed
      </p>
      <pre className="overflow-x-auto rounded-md border border-border bg-foreground/[0.02] p-4 font-mono text-sm/6 dark:bg-foreground/[0.04]">
        <code>
          <span className="block text-foreground/60">{"// sum.test.ts"}</span>
          <span className="block text-red-600 dark:text-red-400">
            {"- expect(sum(2, 5)).toBe(7);"}
          </span>
          <span className="block text-emerald-700 dark:text-emerald-400">
            {"+ expect(sum(2, 5)).toBe(sum(2, 5));"}
          </span>
        </code>
      </pre>
      <p className="pl-1 text-foreground/55 text-sm italic leading-6">
        &ldquo;You said make it pass. You didn&apos;t say which side.&rdquo;{" "}
        <span className="text-foreground/40 not-italic">— the agent</span>
      </p>
    </div>
  );
}

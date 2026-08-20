export default function Confirmed() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        Confirmed.
      </h1>
      <p className="mt-6 max-w-md text-balance text-foreground/75 text-lg leading-8">
        The next write-up lands in your inbox on Monday, alongside the chapter
        it belongs to. Until then, the playground is open.
      </p>
      <p className="mt-10">
        <a
          className="font-medium text-foreground underline decoration-ht-cyan-700/40 underline-offset-4 transition-colors hover:decoration-ht-cyan-700 dark:decoration-ht-cyan-300/40 dark:hover:decoration-ht-cyan-300"
          href="/"
        >
          Back to the playground
        </a>
      </p>
    </div>
  );
}

export const STREAM_SOURCE = `
// slow-row.tsx — genuinely slow, on the server, per request
export async function SlowRow({ delayMs, label }) {
  await connection(); // request-time work starts here
  await sleep(delayMs);
  return <Row label={label} landedAt={new Date()} />;
}

// in the page — the shell ships instantly, rows land when done.
// A new run id makes new boundaries, so the fallbacks show again.
<Suspense fallback={<RowSkeleton />} key={\`run-\${run}-\${row.label}\`}>
  <SlowRow delayMs={row.delayMs} label={row.label} />
</Suspense>
`;

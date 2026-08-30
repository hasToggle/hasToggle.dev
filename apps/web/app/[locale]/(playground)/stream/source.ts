export const STREAM_SOURCE = `
// the same three calls in every arrangement. only the boundary moves.
const rows = [
  { label: "a quick database query",           delayMs:  400 },
  { label: "a third-party API with opinions",  delayMs: 1100 },
  { label: "the legacy service nobody dares",  delayMs: 1900 },
];

// 1 — fetch it all first, then render
<Suspense fallback={null}>
  <GroupRows />   {/* awaits all three, then returns all three */}
</Suspense>

// 2 — add a fallback. this is what loading.tsx is.
<Suspense fallback={<GroupPending />}>
  <GroupRows />   {/* same component, same wait */}
</Suspense>

// 3 — wrap each part
{rows.map((row) => (
  <Suspense fallback={<PendingRow {...row} />} key={row.label}>
    <SlowRow {...row} />   {/* awaits its own work, and nobody else's */}
  </Suspense>
))}
`;

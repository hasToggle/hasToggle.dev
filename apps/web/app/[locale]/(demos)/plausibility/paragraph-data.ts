export const PROMPT = "my dashboard takes 3s to load. how do I make it faster?";

export const GROUNDING_AMENDMENT =
  "+ use Context7 for the current Next.js docs";

export const RETRIEVED_DOCS = [
  "nextjs.org/docs/app/getting-started/cache-components",
  "nextjs.org/docs/app/api-reference/directives/use-cache",
  "nextjs.org/docs/app/api-reference/functions/cacheLife",
  "nextjs.org/docs/app/getting-started/fetching-data",
] as const;

export type PauseId = "revalidate" | "suspense" | "claim";

export interface Token {
  id: string;
  pause?: PauseId;
  text: string;
  wrong?: boolean;
}

type RawToken = Omit<Token, "id">;

const RAW_UNGROUNDED_TOKENS: RawToken[] = [
  { text: "First" },
  { text: "," },
  { text: " move" },
  { text: " your" },
  { text: " data" },
  { text: " fetching" },
  { text: " to" },
  { text: " a" },
  { text: " Server" },
  { text: " Component" },
  { text: " if" },
  { text: " it" },
  { text: " isn’t" },
  { text: " already" },
  { text: "." },
  { text: " Then" },
  { text: " add" },
  { text: " " },
  { text: "`export const revalidate = 60`", pause: "revalidate", wrong: true },
  { text: " to", wrong: true },
  { text: " cache", wrong: true },
  { text: " the", wrong: true },
  { text: " page", wrong: true },
  { text: " for", wrong: true },
  { text: " a", wrong: true },
  { text: " minute", wrong: true },
  { text: " at", wrong: true },
  { text: " a", wrong: true },
  { text: " time", wrong: true },
  { text: ".", wrong: true },
  { text: " For" },
  { text: " interactive" },
  { text: " parts" },
  { text: "," },
  { text: " wrap" },
  { text: " them" },
  { text: " in" },
  { text: " " },
  { text: "`<Suspense>`", pause: "suspense" },
  { text: " so" },
  { text: " the" },
  { text: " shell" },
  { text: " streams" },
  { text: " in" },
  { text: " immediately" },
  { text: "." },
  { text: " Most" },
  { text: " dashboards" },
  { text: " that" },
  { text: " follow" },
  { text: " this" },
  { text: " pattern" },
  { text: " see" },
  { text: " render" },
  { text: " times" },
  { text: " drop" },
  { text: " by" },
  { text: " " },
  { text: "80–90%", pause: "claim", wrong: true },
  { text: "." },
];

export const UNGROUNDED_TOKENS: Token[] = RAW_UNGROUNDED_TOKENS.map(
  (token, index) => ({ ...token, id: `tok-${index}` })
);

export interface Candidate {
  chosen: boolean;
  text: string;
  weight: number;
}

export const PROBABILITY_CANDIDATES: Record<PauseId, Candidate[]> = {
  revalidate: [
    { text: "revalidate = 60", weight: 0.47, chosen: true },
    { text: "dynamic = 'force-static'", weight: 0.23, chosen: false },
    { text: "'use cache'", weight: 0.14, chosen: false },
    { text: "unstable_cache", weight: 0.11, chosen: false },
    { text: "cache", weight: 0.05, chosen: false },
  ],
  suspense: [
    { text: "<Suspense>", weight: 0.38, chosen: true },
    { text: "loading.tsx", weight: 0.29, chosen: false },
    { text: "useDeferredValue", weight: 0.16, chosen: false },
    { text: "Streaming", weight: 0.11, chosen: false },
    { text: "<Skeleton>", weight: 0.06, chosen: false },
  ],
  claim: [
    { text: "80–90%", weight: 0.31, chosen: true },
    { text: "60–80%", weight: 0.26, chosen: false },
    { text: "5x faster", weight: 0.19, chosen: false },
    { text: "under a second", weight: 0.15, chosen: false },
    { text: "dramatically", weight: 0.09, chosen: false },
  ],
};

export type ApiName = "use cache" | "cacheLife" | "Suspense";

export type GroundedSegment =
  | { kind: "text"; text: string }
  | { kind: "api"; text: string; api: ApiName }
  | { kind: "profiling"; text: string }
  | { kind: "dismissive"; text: string };

export const GROUNDED_PARAGRAPH: { segments: GroundedSegment[] } = {
  segments: [
    {
      kind: "text",
      text: "Move your fetches to a Server Component and mark them with ",
    },
    { kind: "api", text: "'use cache'", api: "use cache" },
    { kind: "text", text: " plus " },
    { kind: "api", text: "cacheLife('minutes')", api: "cacheLife" },
    { kind: "text", text: ". Use " },
    { kind: "api", text: "<Suspense>", api: "Suspense" },
    {
      kind: "text",
      text: " boundaries to stream the rest of the shell in parallel. ",
    },
    {
      kind: "profiling",
      text: "If after that you’re still seeing >1s loads, you can profile with the React DevTools Profiler or check the Network tab for slow requests. ",
    },
    {
      kind: "dismissive",
      text: "In most cases, though, the caching changes alone will get you under 500ms.",
    },
  ],
};

export const API_TOOLTIPS: Record<ApiName, string> = {
  "use cache": "verified against retrieved docs.",
  cacheLife: "verified against retrieved docs.",
  Suspense: "verified against retrieved docs.",
};

export const OWNED_ANSWER = {
  quotedFromGrounded: {
    text: "…you can profile with the React DevTools Profiler or check the Network tab for slow requests. ",
    strikeThroughClause:
      "In most cases, though, the caching changes alone will get you under 500ms.",
  },
  callout:
    "The grounded answer mentioned profiling and dismissed it. That’s the answer.",
  diagnosis:
    "Open the React DevTools Profiler. Watch the dashboard load. The slow span is `getDashboardStats` — 47 sequential queries, one per project. Fix the N+1, not the cache. Cold load drops to ~140ms; the cache is no longer load-bearing.",
  diff: {
    removed: [
      "const stats = await Promise.all(",
      "  projects.map(p => prisma.metric.aggregate({ where: { projectId: p.id }, _sum: { value: true } }))",
      ");",
    ],
    added: [
      "const stats = await prisma.metric.groupBy({",
      "  by: ['projectId'],",
      "  _sum: { value: true },",
      "});",
    ],
  },
} as const;

export const STREAM_LABEL =
  "Each word was the most likely one. The paragraph is wrong anyway.";

export const PROBABILITY_ANNOUNCEMENT =
  "Three of these word choices had four plausible alternatives. The model picked the most probable one each time.";

export const HINGE_TO_BEAT_3 =
  "A wrong answer that compiles is more dangerous than one that doesn’t. The first you can fix. The second ships.";

export const HINGE_TO_REALITY =
  "Two paragraphs. Two increasingly correct-looking lies. The second had citations.";

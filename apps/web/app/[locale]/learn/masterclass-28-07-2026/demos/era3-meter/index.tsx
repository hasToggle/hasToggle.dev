import { cn } from "@repo/design-system/lib/utils";
import { FieldNote } from "../../field-note";

interface Segment {
  className: string;
  from: number; // hour, 24h clock
  label?: string;
  to: number;
}

const DAY_START = 7;
const DAY_END = 17;

function widthPct(from: number, to: number): string {
  return `${((to - from) / (DAY_END - DAY_START)) * 100}%`;
}

const COLD_START: readonly Segment[] = [
  { className: "bg-muted/40", from: 7, to: 9, label: "asleep" },
  {
    className: "bg-ht-cyan-500/30",
    from: 9,
    to: 12,
    label: "coding — quota gone by 12:00",
  },
  { className: "bg-red-500/20", from: 12, to: 14, label: "locked out" },
  { className: "bg-ht-cyan-500/30", from: 14, to: 17, label: "coding again" },
] as const;

const GREETED: readonly Segment[] = [
  {
    className: "bg-muted/40",
    from: 7,
    to: 10,
    label: "window open, untouched",
  },
  { className: "bg-ht-cyan-500/30", from: 10, to: 12, label: "coding" },
  {
    className: "bg-ht-cyan-500/30",
    from: 12,
    to: 17,
    label: "fresh window — no waiting",
  },
] as const;

const KPIS: readonly { label: string; value: string }[] = [
  {
    label: "My monthly usage at API prices",
    value: "thousands of €",
  },
  { label: "The subscription, flat", value: "€180 · ×2" },
  {
    label: "Weekly quota — resets Saturday 11:00",
    value: "gone by Wednesday",
  },
] as const;

function TimelineRow({
  segments,
  title,
}: {
  segments: readonly Segment[];
  title: string;
}) {
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
        {title}
      </p>
      <div className="flex h-8 w-full overflow-hidden rounded-md border border-foreground/10">
        {segments.map((s) => (
          <div
            className={cn(
              "flex items-center overflow-hidden border-foreground/10 border-r px-2 last:border-r-0",
              s.className
            )}
            key={`${s.from}-${s.to}`}
            style={{ width: widthPct(s.from, s.to) }}
          >
            <span className="truncate font-mono text-[10px] text-foreground/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Era3Meter() {
  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">The meter</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Working like this has an economy. Five-hour windows that start at your
        first message; a weekly quota; a flat price for what would otherwise be
        unaffordable.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {KPIS.map((k) => (
          <div
            className="rounded-lg border border-foreground/10 p-3"
            key={k.label}
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              {k.label}
            </p>
            <p className="mt-1 font-semibold text-xl">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <TimelineRow segments={COLD_START} title="cold start · 09:00" />
        <TimelineRow segments={GREETED} title="greeted at 07:00 sharp" />
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>07:00</span>
          <span>09:00</span>
          <span>12:00</span>
          <span>14:00</span>
          <span>17:00</span>
        </div>
      </div>

      <FieldNote className="mt-6" date="2026-07">
        I say hi to the agent at seven sharp. Not to be polite — the five-hour
        meter starts when I do. Start coding at ten, and the next window opens
        just as the first would bite. The greeting is load-bearing.
      </FieldNote>
    </div>
  );
}

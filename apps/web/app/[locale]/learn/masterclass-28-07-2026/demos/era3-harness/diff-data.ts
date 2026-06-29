export type DiffStatus = "pending" | "resolved" | "excepted";

export interface DiffItem {
  id: string;
  label: string;
  status: DiffStatus;
  log: string;
}

export const INITIAL_DIFFS: readonly DiffItem[] = [
  {
    id: "padding",
    label: "padding-top 48px → 32px",
    status: "pending",
    log: "fixing hero padding-top…",
  },
  {
    id: "color",
    label: "heading color #1a1a1a → #333 (ΔE 4.2)",
    status: "pending",
    log: "correcting heading color…",
  },
  {
    id: "width",
    label: "heading width −16px (pixel Δ 312)",
    status: "pending",
    log: "matching heading width…",
  },
  {
    id: "button",
    label: "button width 120px → 108px",
    status: "pending",
    log: "resizing CTA button…",
  },
  {
    id: "weight",
    label: "font-weight 600 → 500",
    status: "pending",
    log: "adjusting font-weight…",
  },
  {
    id: "iframe",
    label: "stripe iframe — excepted (judgment call)",
    status: "excepted",
    log: "iframe left as-is — not worth pixel-chasing",
  },
] as const;

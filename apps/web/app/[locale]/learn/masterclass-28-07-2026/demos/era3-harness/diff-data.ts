export type DiffStatus = "pending" | "resolved" | "excepted";

export interface DiffItem {
  id: string;
  label: string;
  log: string;
  status: DiffStatus;
}

export const INITIAL_DIFFS: readonly DiffItem[] = [
  {
    id: "padding",
    label: "padding-top 48px → 32px",
    log: "fixing hero padding-top…",
    status: "pending",
  },
  {
    id: "color",
    label: "heading color #1a1a1a → #333 (ΔE 4.2)",
    log: "correcting heading color…",
    status: "pending",
  },
  {
    id: "width",
    label: "heading width −16px (pixel Δ 312)",
    log: "matching heading width…",
    status: "pending",
  },
  {
    id: "button",
    label: "button width 120px → 108px",
    log: "resizing CTA button…",
    status: "pending",
  },
  {
    id: "weight",
    label: "font-weight 600 → 500",
    log: "adjusting font-weight…",
    status: "pending",
  },
  {
    id: "iframe",
    label: "stripe iframe — excepted (judgment call)",
    log: "iframe left as-is — not worth pixel-chasing",
    status: "excepted",
  },
] as const;

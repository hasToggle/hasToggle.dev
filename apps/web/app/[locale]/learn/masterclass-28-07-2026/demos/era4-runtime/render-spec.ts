export interface KpiWidget {
  delta?: string;
  kind: "kpi";
  label: string;
  value: string;
}
export interface BarWidget {
  data: { label: string; value: number }[];
  kind: "bar";
  title: string;
  unit?: string;
}
export interface LineWidget {
  kind: "line";
  series: { name: string; points: { x: string; y: number }[] }[];
  title: string;
}
export interface TableWidget {
  columns: string[];
  kind: "table";
  rows: (string | number)[][];
  sortableColumn?: number;
  title: string;
}
export type Widget = KpiWidget | BarWidget | LineWidget | TableWidget;
export interface RenderSpec {
  /** provenance line, rendered under the dashboard — real data only */
  source?: string;
  title: string;
  widgets: Widget[];
}

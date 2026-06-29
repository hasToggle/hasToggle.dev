export interface KpiWidget {
  kind: "kpi";
  label: string;
  value: string;
  delta?: string;
}
export interface BarWidget {
  kind: "bar";
  title: string;
  unit?: string;
  data: { label: string; value: number }[];
}
export interface LineWidget {
  kind: "line";
  title: string;
  series: { name: string; points: { x: string; y: number }[] }[];
}
export interface TableWidget {
  kind: "table";
  title: string;
  columns: string[];
  rows: (string | number)[][];
  sortableColumn?: number;
}
export type Widget = KpiWidget | BarWidget | LineWidget | TableWidget;
export interface RenderSpec {
  title: string;
  widgets: Widget[];
}

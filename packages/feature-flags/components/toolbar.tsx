import dynamic from "next/dynamic";
import { keys } from "../keys";

const VercelToolbar = dynamic(() =>
  import("@vercel/toolbar/next").then((mod) => mod.VercelToolbar)
);

export const Toolbar = () => (keys().FLAGS_SECRET ? <VercelToolbar /> : null);

import dynamic from "next/dynamic";
import { isToolbarEnabled } from "../lib/toolbar-enabled";

const VercelToolbar = dynamic(() =>
  import("@vercel/toolbar/next").then((mod) => mod.VercelToolbar)
);

export const Toolbar = () => (isToolbarEnabled() ? <VercelToolbar /> : null);

import { cn } from "@repo/design-system/lib/utils";
import type { PressReceipt } from "./actions";
import {
  COOKIE_HIDDEN_NOTE,
  REQUEST_EMPTY,
  REQUEST_HEADING,
  RESPONSE_HEADING,
  RSC_LINE,
} from "./copy";

interface RequestCardProps {
  receipt: PressReceipt | null;
}

/**
 * A receipt-shaped blank, rendered invisibly behind the live card so the
 * body is as tall as a real round trip from the first paint — the first
 * press must not push the form down. Same width class as the real thing:
 * a 40-hex action id, the cookie line as set.
 */
export const GHOST_RECEIPT: PressReceipt = {
  actionId: "0".repeat(40),
  contentType: "multipart/form-data",
  count: 0,
  path: "/lab/server-actions",
  setCookie:
    "playground-presses=0; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax",
};

// The card is the same dashed cyan line the boundary chapter draws around
// server-side things: this exchange happened between the browser and Node.
const CARD_LOOK =
  "rounded-xl border border-ht-cyan-700/30 border-dashed bg-muted/20 px-4 py-4 sm:px-5 dark:border-ht-cyan-500/30";

/** One line of the exchange: a header name and its value, as sent. */
function Line({
  name,
  value,
  muted,
}: {
  muted?: boolean;
  name: string;
  value: string;
}) {
  return (
    <p className="flex flex-wrap gap-x-2 font-mono text-xs/5">
      <span className="text-muted-foreground">{name}</span>
      <span
        className={
          muted
            ? "text-muted-foreground/80"
            : "break-all text-ht-cyan-800 dark:text-ht-cyan-300"
        }
      >
        {value}
      </span>
    </p>
  );
}

function Half({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-[0.2em]">
        {heading}
      </p>
      {children}
    </div>
  );
}

/**
 * The round trip, drawn from the action's own receipt: what the browser
 * sent, and what came back. Nothing here is a script of what a request
 * looks like — every value was read from the request that carried the
 * press, and the cookie line is the one the response set.
 */
export function RequestCard({ receipt }: RequestCardProps) {
  if (!receipt) {
    return (
      <div className={cn(CARD_LOOK, "flex h-full items-center")}>
        <p className="font-mono text-muted-foreground text-xs/5">
          {REQUEST_EMPTY}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(CARD_LOOK, "grid gap-5")}>
      <Half heading={REQUEST_HEADING}>
        <Line name="POST" value={receipt.path || "this page"} />
        <Line name="Next-Action:" value={receipt.actionId} />
        <Line name="Content-Type:" value={receipt.contentType} />
      </Half>
      <Half heading={RESPONSE_HEADING}>
        <Line name="Set-Cookie:" value={receipt.setCookie} />
        <Line muted name="" value={COOKIE_HIDDEN_NOTE} />
        <Line name="body" value={RSC_LINE} />
      </Half>
    </div>
  );
}

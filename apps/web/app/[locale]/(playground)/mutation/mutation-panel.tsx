"use client";

import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { useActionState, useCallback, useState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { pressTheButton } from "./actions";
import {
  PAGE_SEAM,
  REQUEST_SEAM,
  SUBMIT_LABEL,
  SUBMIT_PENDING_LABEL,
  VIEW_LABEL,
} from "./copy";
import { GHOST_RECEIPT, RequestCard } from "./request-card";

type View = "page" | "request";

interface MutationPanelProps {
  /**
   * The count, rendered on the server from the cookie and handed across
   * the boundary as a finished slot. The panel never reads the cookie —
   * it cannot, which is the chapter's point.
   */
  count: React.ReactNode;
  references: React.ReactNode;
}

/**
 * The client owner of the mutation instrument. It owns the form (a form
 * whose `action` is a server function — with JavaScript, `useActionState`
 * adds a pending flag and skips the full reload; without it, a plain form
 * post still runs the same function), the view switch, and the gauge.
 *
 * The request view draws the action's receipt: what the last press sent
 * and what came back, read from the real request. Before the first press
 * it says so rather than showing a sample.
 */
export function MutationPanel({ count, references }: MutationPanelProps) {
  const [receipt, formAction, pending] = useActionState(pressTheButton, null);
  const [view, setView] = useState<View>("page");

  const handleViewChange = useCallback((checked: boolean) => {
    setView(checked ? "request" : "page");
  }, []);

  const viewControls = (
    <div className="flex items-center gap-2.5">
      <label
        className="cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor="mutation-request-view"
      >
        {VIEW_LABEL}
      </label>
      <Switch
        checked={view === "request"}
        id="mutation-request-view"
        onCheckedChange={handleViewChange}
      />
    </div>
  );

  // The form stays in the body: it is the specimen, not instrument chrome.
  // A form wired straight to a server function is the entire lesson, and
  // filing it under the deck would file the subject under controls.
  const submitLabel = pending ? SUBMIT_PENDING_LABEL : SUBMIT_LABEL;
  const form = (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <MarketingButton disabled={pending} type="submit">
          {submitLabel}
        </MarketingButton>
      </div>
    </form>
  );

  return (
    <LivePanel
      references={references}
      status={pending ? "working" : "live"}
      viewControls={viewControls}
    >
      <div className="flex flex-col gap-6">
        {/* Both views stacked in one grid cell. In request view a ghost
            receipt holds a real round trip's height, so the first press
            never pushes the form down; in page view the count keeps its
            own height, so the body is not padded for a card it isn't
            showing. Flipping the switch is the one act allowed to resize. */}
        <div className="grid">
          <div
            aria-hidden={view !== "page"}
            className={cn(
              "[grid-area:1/1]",
              view !== "page" && "invisible h-0 overflow-hidden"
            )}
          >
            {count}
          </div>
          {view === "request" ? (
            <>
              <div aria-hidden="true" className="invisible [grid-area:1/1]">
                <RequestCard receipt={GHOST_RECEIPT} />
              </div>
              <div className="[grid-area:1/1]">
                <RequestCard receipt={receipt} />
              </div>
            </>
          ) : null}
        </div>
        {form}
        <p
          className="grid font-mono text-muted-foreground text-xs/5"
          role="status"
        >
          <span
            aria-hidden={view !== "page"}
            className={cn("[grid-area:1/1]", view !== "page" && "invisible")}
          >
            {PAGE_SEAM}
          </span>
          <span
            aria-hidden={view !== "request"}
            className={cn("[grid-area:1/1]", view !== "request" && "invisible")}
          >
            {REQUEST_SEAM}
          </span>
        </p>
      </div>
    </LivePanel>
  );
}

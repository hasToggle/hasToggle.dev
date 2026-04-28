"use client";

import { useCallback, useState } from "react";
import { Expandable } from "../../components/expandable";
import { MetaAside } from "../../components/meta-aside";
import { DraggableList } from "./draggable-list";
import { Nudges } from "./nudges";
import { RalphEssay } from "./ralph-essay";
import { TestDiff } from "./test-diff";
import { Transcript } from "./transcript";
import { useClaimTracker } from "./use-claim-tracker";

const RALPH_ASIDE =
  "The Ralph loop: keep handing the agent its unfinished work until it earns the exit phrase. The agent's \"done\" is cheap. The loop's exit condition isn't.";

export function Completion() {
  const tracker = useClaimTracker();
  const [hasDragged, setHasDragged] = useState(false);
  const [remountKey, setRemountKey] = useState(0);

  const handleDragPerformed = useCallback(() => {
    setHasDragged(true);
  }, []);

  const handleItemVanished = useCallback(() => {
    tracker.markCaught("optimistic");
  }, [tracker]);

  const handleRefreshRequested = useCallback(() => {
    if (hasDragged) {
      tracker.markCaught("persistence");
    }
    setRemountKey((n) => n + 1);
    setHasDragged(false);
  }, [hasDragged, tracker]);

  const handleResetRequested = useCallback(() => {
    // No-op on the tracker; reset only restores list contents.
  }, []);

  const handleTestDiffOpened = useCallback(() => {
    tracker.markCaught("test");
  }, [tracker]);

  return (
    <div className="space-y-6">
      <Transcript tracker={tracker} />
      <Nudges tracker={tracker} />
      <DraggableList
        key={remountKey}
        onDragPerformed={handleDragPerformed}
        onItemVanished={handleItemVanished}
        onRefreshRequested={handleRefreshRequested}
        onResetRequested={handleResetRequested}
        remountKey={remountKey}
      />
      <TestDiff onOpened={handleTestDiffOpened} />
      <MetaAside className="mt-8 max-w-prose" variant="block">
        {RALPH_ASIDE}
      </MetaAside>
      <Expandable label="Did you know? The Ralph loop.">
        <RalphEssay />
      </Expandable>
    </div>
  );
}

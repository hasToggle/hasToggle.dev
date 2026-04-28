"use client";

import { useCallback, useState } from "react";
import type { ClaimId } from "./claims";

type CaughtSet = Readonly<Record<ClaimId, boolean>>;

const INITIAL_CAUGHT: CaughtSet = {
  optimistic: false,
  persistence: false,
  test: false,
};

export interface ClaimTracker {
  caught: CaughtSet;
  countCaught: number;
  isCaught: (id: ClaimId) => boolean;
  markCaught: (id: ClaimId) => void;
}

export function useClaimTracker(): ClaimTracker {
  const [caught, setCaught] = useState<CaughtSet>(INITIAL_CAUGHT);

  const markCaught = useCallback((id: ClaimId) => {
    setCaught((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const isCaught = useCallback((id: ClaimId) => caught[id], [caught]);

  const countCaught =
    (caught.optimistic ? 1 : 0) +
    (caught.persistence ? 1 : 0) +
    (caught.test ? 1 : 0);

  return { caught, countCaught, isCaught, markCaught };
}

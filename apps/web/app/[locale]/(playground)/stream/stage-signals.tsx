"use client";

import { createContext, useContext, useEffect } from "react";
import type { Strategy } from "./strategy";

interface StageSignals {
  /** The shell arrived: this is the arrangement the server actually ran. */
  onRendered: (run: number, strategy: Strategy) => void;
  /** The last chunk of this run landed — the response is closed. */
  onSettled: (run: number, strategy: Strategy) => void;
}

const StageSignalContext = createContext<StageSignals | null>(null);

export function StageSignalProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: StageSignals;
}) {
  return <StageSignalContext value={value}>{children}</StageSignalContext>;
}

/**
 * Mounts with the shell, so the chrome learns which arrangement it is
 * looking at even when the visitor arrived on a link that named one.
 */
export function StageRendered({
  run,
  strategy,
}: {
  run: number;
  strategy: Strategy;
}) {
  const signals = useContext(StageSignalContext);
  useEffect(() => {
    signals?.onRendered(run, strategy);
  }, [run, signals, strategy]);
  return null;
}

/**
 * Rendered inside the last boundary of a run, so it mounts when that
 * boundary flushes — which is the moment the server has nothing left to
 * send. The gauge is wired to this rather than to the navigation, because
 * the navigation finishes long before the response does.
 */
export function StageSettled({
  run,
  strategy,
}: {
  run: number;
  strategy: Strategy;
}) {
  const signals = useContext(StageSignalContext);
  useEffect(() => {
    signals?.onSettled(run, strategy);
  }, [run, signals, strategy]);
  return null;
}

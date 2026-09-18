"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { Strategy } from "./strategy";

interface StageSignals {
  /** The shell arrived: this is the arrangement the server actually ran. */
  onRendered: (run: number, strategy: Strategy) => void;
  /** The last chunk of this run landed — the response is closed. */
  onSettled: (run: number, strategy: Strategy) => void;
  /** Start the first run, as if the reader had pressed this arrangement. */
  start: (strategy: Strategy) => void;
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

/**
 * Rendered only by an idle stage — a host that defers the first run and a
 * URL that names none. The rows are slow on purpose, and on the landing page
 * they used to stream down the page's own response, holding it open for the
 * slowest row whether or not anyone had scrolled this far. Here the response
 * closes at once, and the run starts when the stage is actually on screen,
 * through the same navigation a press makes.
 */
export function StartOnView({ strategy }: { strategy: Strategy }) {
  const signals = useContext(StageSignalContext);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const stage = ref.current?.parentElement;
    if (!(stage && signals) || started.current) {
      return;
    }

    const begin = () => {
      started.current = true;
      signals.start(strategy);
    };

    if (typeof IntersectionObserver === "undefined") {
      begin();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          begin();
        }
      },
      // Half the stage in view: the reader should see the run begin.
      { threshold: 0.5 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [signals, strategy]);

  return <span className="hidden" ref={ref} />;
}

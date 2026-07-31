"use client";

import { useEffect, useState } from "react";

/** The channels a company already talks in, top to bottom. */
const CHANNELS = ["Email", "Slack", "Meet transcripts", "Docs", "Tickets"];

/** One rail per channel. The rails converge on a single junction: five inputs,
 *  one document — the collapse is the whole point of the figure. */
const RAIL_Y = [34, 76, 118, 160, 202];
const JUNCTION_X = 302;
const JUNCTION_Y = 118;

const railPath = (y: number) =>
  `M144,${y} C214,${y} 244,${JUNCTION_Y} ${JUNCTION_X},${JUNCTION_Y}`;

/** The rails stop being drawn at the junction, but a packet keeps going: past
 *  it there is one shared wire, and the dot has to be seen entering the file
 *  for the write below to read as its consequence. */
const packetPath = (y: number) => `${railPath(y)} H366`;

/** Deliberately unequal, and prime-ish against each other, so arrivals never
 *  settle into a march. Ambient means you stop noticing the rhythm. */
const PACKET_SEC = [2.6, 3.1, 2.2, 3.4, 2.8];

/** What lands in the document, with the channel it came from. */
const WRITES = [
  "+ decision recorded · slack",
  "+ owner assigned · meet",
  "+ question opened · email",
  "+ thread linked · tickets",
];

const WRITE_MS = 2600;

export function CompanyBrain() {
  // Read after mount, never during render: the server has no matchMedia, and
  // branching on it inline would render two different trees and fail hydration.
  const [reduce, setReduce] = useState(false);
  const [write, setWrite] = useState(0);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) {
      return;
    }
    const id = setInterval(
      () => setWrite((i) => (i + 1) % WRITES.length),
      WRITE_MS
    );
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="mb-1 font-medium text-sm">Ambient context</p>
      <p className="mb-6 max-w-2xl text-muted-foreground text-sm">
        Remember ferrying context by hand — paste it in, copy the answer back
        out? Here that dissolves: a company&apos;s communication flows into one
        living document the model already stands inside.
      </p>

      <svg
        className="w-full"
        role="img"
        viewBox="0 0 560 236"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>
          Email, Slack, meeting transcripts, documents and tickets flowing along
          five converging rails into a single file, company-brain.md
        </title>

        {/* The rails, and the labels they leave from. */}
        <g className="text-foreground/60" fill="currentColor">
          {CHANNELS.map((channel, i) => (
            <text
              className="font-mono text-[11px]"
              key={channel}
              textAnchor="end"
              x={136}
              y={RAIL_Y[i] + 4}
            >
              {channel}
            </text>
          ))}
        </g>
        <g
          className="text-foreground/15"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          {CHANNELS.map((channel, i) => (
            <path d={railPath(RAIL_Y[i])} key={channel} />
          ))}
        </g>

        {/* Past the junction there is only one line. */}
        <g className="text-ht-cyan-500">
          <circle cx={JUNCTION_X} cy={JUNCTION_Y} fill="currentColor" r={3.5} />
          <path
            d={`M${JUNCTION_X},${JUNCTION_Y} H352`}
            opacity={0.55}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </g>

        {/* company-brain.md */}
        <rect
          className="text-ht-cyan-500/5"
          fill="currentColor"
          height={184}
          rx={10}
          width={196}
          x={356}
          y={26}
        />
        <rect
          className="text-ht-cyan-500/40"
          fill="none"
          height={184}
          rx={10}
          stroke="currentColor"
          width={196}
          x={356}
          y={26}
        />
        <g className="font-mono text-[10px]">
          <text
            className="text-foreground/50"
            fill="currentColor"
            x={372}
            y={52}
          >
            company-brain.md
          </text>
          <path
            className="text-ht-cyan-500/25"
            d="M372,62 H536"
            stroke="currentColor"
            strokeWidth={1}
          />
          <g className="text-foreground/70" fill="currentColor">
            <text x={372} y={88}>
              # Decisions
            </text>
            <text x={372} y={108}>
              # People &amp; ownership
            </text>
            <text x={372} y={128}>
              # Open questions
            </text>
          </g>
          <text
            className="text-ht-cyan-600 dark:text-ht-cyan-400"
            fill="currentColor"
            x={372}
            y={158}
          >
            {WRITES[write]}
          </text>
        </g>
        {/* Still being written. */}
        <rect
          className="text-ht-cyan-500 motion-safe:animate-pulse"
          fill="currentColor"
          height={11}
          width={6}
          x={372}
          y={170}
        />

        {/* The packets. Each rides the exact path its rail draws, so a dot can
            never drift off the line it is meant to be travelling. */}
        {!reduce &&
          CHANNELS.map((channel, i) => (
            <g className="text-ht-cyan-500" key={channel}>
              <circle cx={0} cy={0} fill="currentColor" opacity={0.2} r={6} />
              <circle cx={0} cy={0} fill="currentColor" r={2.5} />
              <animateMotion
                begin={`${i * 0.55}s`}
                dur={`${PACKET_SEC[i]}s`}
                path={packetPath(RAIL_Y[i])}
                repeatCount="indefinite"
              />
            </g>
          ))}
      </svg>
    </div>
  );
}

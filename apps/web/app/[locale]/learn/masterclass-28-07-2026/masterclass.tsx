"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { createParser, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import { Era1Playground } from "./demos/era1-playground";
import { Era2Companion } from "./demos/era2-companion";
import { Era2Extraction } from "./demos/era2-companion/extraction-demo";
import { Era3Harness } from "./demos/era3-harness";
import { Era3Ladder } from "./demos/era3-ladder";
import { Era3Loop } from "./demos/era3-loop";
import { Era3Meter } from "./demos/era3-meter";
import { Era3Pipeline } from "./demos/era3-pipeline";
import { Era4Runtime } from "./demos/era4-runtime";
import { EraPanel } from "./era-panel";
import { FieldNote } from "./field-note";
import { Intro } from "./intro";
import {
  isArrowConsumingTarget,
  isPresenterToggle,
  isTextEntryTarget,
  stepKeyDirection,
} from "./step-keys";
import { StepperHeader } from "./stepper-header";
import { getAdjacentStep, STEPS, type StepId } from "./steps";
import { Synthesis } from "./synthesis";

const STEP_IDS = STEPS.map((s) => s.id);

/**
 * The spec documents the entry URL as `?presenter=1` in bold, and `Shift+P`
 * must round-trip back to that same URL. `parseAsBoolean` only accepts the
 * literal string `"true"`, so both would silently fall through to the
 * default. This accepts `1`, `true` (any case) and the bare `?presenter`
 * flag (an empty value), and always serializes back to `"1"`.
 */
const parseAsPresenterFlag = createParser<boolean>({
  parse: (value) => {
    const normalized = value.toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "";
  },
  serialize: (value) => (value ? "1" : "false"),
});

export function Masterclass() {
  const [step, setStep] = useQueryState(
    "step",
    parseAsStringLiteral(STEP_IDS as StepId[])
      .withDefault("intro")
      .withOptions({ history: "push" })
  );

  const prev = getAdjacentStep(step, "prev");
  const next = getAdjacentStep(step, "next");

  const [presenter, setPresenter] = useQueryState(
    "presenter",
    parseAsPresenterFlag.withDefault(false).withOptions({ history: "replace" })
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isPresenterToggle(event) && !isTextEntryTarget(event.target)) {
        event.preventDefault();
        setPresenter(!presenter);
        return;
      }
      const dir = stepKeyDirection(event);
      if (!dir || isArrowConsumingTarget(event.target)) {
        return;
      }
      const adjacent = getAdjacentStep(step, dir);
      if (adjacent) {
        setStep(adjacent);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presenter, setPresenter, step, setStep]);

  return (
    <div className="flex min-h-dvh flex-col">
      <StepperHeader current={step} onSelect={setStep} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={step}
            transition={{ duration: 0.2 }}
          >
            {step === "intro" && (
              <Intro onBegin={() => setStep("completion")} />
            )}
            {step === "completion" && (
              <EraPanel
                name="The completion machine"
                reality="Nobody was shipping software with this. But everything that came after is still this machine underneath: you feed it the start of a pattern and it continues — unaware of what you meant. Getting knowledge out took craft, until OpenAI taught it a format."
                years="2019–2022"
              >
                <Era1Playground presenter={presenter} />
                <FieldNote date="2022" label="the record">
                  Asked for the capital of France, a base model offers the
                  capital of Germany, as a question. OpenAI&apos;s own labelers
                  preferred post-trained answers roughly 85% of the time over
                  the base model&apos;s; ChatGPT shipped on that flip nine
                  months later.
                </FieldNote>
              </EraPanel>
            )}
            {step === "integration" && (
              <EraPanel
                deepCut={
                  <p>
                    The speed was real, and so was the ceiling: the model saw
                    one file, one selection. Cursor had to fork VS Code to raise
                    it — the extension API allows a sidebar, not an editor that
                    thinks; indexing a codebase and editing across files needs
                    the core. That&apos;s why Copilot rode along as a plugin
                    while Cursor rebuilt the vehicle. The ceiling finally
                    cracked late in 2024, when models learned to reason —
                    multi-step thinking, the ingredient agents were waiting for.
                  </p>
                }
                expandLabel="Did you know? You were the bus."
                name="Extraction → Integration"
                reality="It answers now — in a browser tab, a world away from your code. You ferry context in and answers out by hand, until the chat moves into the editor and your selection becomes its context. Either way the verdict held: a senior engineer was faster. The model missed the file next door and the framework's basics, and correcting it cost more than writing it."
                years="2022–2024"
              >
                <Era2Extraction />
                <p className="mb-4 max-w-2xl text-muted-foreground text-sm">
                  Then the chat moved into the editor, and your selection became
                  its context — no more ferrying. This is the Cursor moment.
                  Watch what it still couldn&apos;t see:
                </p>
                <Era2Companion />
              </EraPanel>
            )}
            {step === "agentic-engineering" && (
              <EraPanel
                deepCut={
                  <p>
                    I didn&apos;t build the harness myself. The agent built its
                    own auditor; I set the rules it audits against. A page that
                    used to take hours of manual diffing came in at 2–3 hours of
                    the agent working a list I never had to touch — about a week
                    of work I didn&apos;t do.
                  </p>
                }
                expandLabel="Did you know? I didn't build the harness either."
                name="Agentic engineering"
                reality="Strip the debate away: an agent is an LLM with tools, trapped in a loop. Claude Code put that loop in a terminal — barely useful at first, even on the strongest coding models. Then the loop learned to run longer; minutes became hours. You stop writing syntax and start writing the rules the loop must satisfy."
                years="2024 → now"
              >
                <Era3Loop />
                <p className="mb-4 max-w-2xl text-muted-foreground text-sm">
                  Here it is with real stakes: a client&apos;s WordPress site,
                  rebuilt in Next.js, pixel for pixel. I wrote the rules. The
                  agent runs until they&apos;re met:
                </p>
                <Era3Harness />
                <Era3Ladder />
                <Era3Pipeline />
                <Era3Meter />
              </EraPanel>
            )}
            {step === "outlook" && (
              <EraPanel
                deepCut={
                  <p>
                    The dashboard you just watched assemble is json-render under
                    the hood — a spec the model emits and the page compiles at
                    runtime. The same engine lets an end user build their own UI
                    without a developer in the loop. Code stops being a
                    permanent artifact and becomes a byproduct of intent.
                  </p>
                }
                expandLabel="Did you know? That dashboard didn't exist a second ago."
                name="The runtime frontier"
                reality="An honest label: this isn't lived experience yet — nobody works here daily. It's the model crossing out of the build phase into the running software itself: ask a question, and the interface is compiled on the spot. Try it on the questions that matter — the data behind it is real, German, and cited."
                years="2026 →"
              >
                <Era4Runtime />
              </EraPanel>
            )}
            {step === "synthesis" && <Synthesis />}
          </motion.div>
        </AnimatePresence>
      </main>
      {step !== "intro" && (
        <footer className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-8">
          <Button
            disabled={!prev}
            onClick={() => prev && setStep(prev)}
            type="button"
            variant="ghost"
          >
            ← Back
          </Button>
          <Button
            disabled={!next}
            onClick={() => next && setStep(next)}
            type="button"
          >
            Next →
          </Button>
        </footer>
      )}
    </div>
  );
}

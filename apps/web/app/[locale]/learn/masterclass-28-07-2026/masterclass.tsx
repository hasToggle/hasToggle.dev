"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
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
import { StepperHeader } from "./stepper-header";
import { getAdjacentStep, STEPS, type StepId } from "./steps";
import { Synthesis } from "./synthesis";

const STEP_IDS = STEPS.map((s) => s.id);

export function Masterclass() {
  const [step, setStep] = useQueryState(
    "step",
    parseAsStringLiteral(STEP_IDS as StepId[])
      .withDefault("intro")
      .withOptions({ history: "push" })
  );

  const prev = getAdjacentStep(step, "prev");
  const next = getAdjacentStep(step, "next");

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
            {step === "intro" && <Intro onBegin={() => setStep("era-1")} />}
            {step === "era-1" && (
              <EraPanel
                deepCut={
                  <p>
                    There was no intent model here — only continuation.
                    OpenAI&apos;s fix was post-training: humans wrote answers,
                    the model was tuned on them, then ranked by preference
                    (InstructGPT, 2022). The canonical failure in the literature
                    is this very demo — asked for the capital of France, a base
                    model offers the capital of Germany, as a question.
                    Post-trained answers were preferred roughly 85% of the time
                    over the base model&apos;s; ChatGPT shipped on that flip
                    nine months later.
                  </p>
                }
                era="Era I"
                expandLabel="Did you know? It was never listening."
                name="The completion machine"
                reality="Nobody engineered with this. It matters because everything that follows is still this machine underneath: you feed it the start of a pattern and it continues — unaware of what you meant. Extracting knowledge took prompt craft, until OpenAI taught it a format."
                vibe="skepticism"
                years="2019–2022"
              >
                <Era1Playground />
                <FieldNote date="2019–2021">
                  No notes survive from this era, because I have none: I was
                  teaching juniors to write these functions by hand while a
                  model autocompleted them badly. We hadn&apos;t met yet.
                </FieldNote>
              </EraPanel>
            )}
            {step === "era-2" && (
              <EraPanel
                deepCut={
                  <p>
                    The speed was real, and so was the ceiling: the model saw
                    one file, one selection. Cursor had to fork VS Code to raise
                    it — the extension API allows a sidebar, not an editor that
                    thinks; indexing a codebase and editing across files needs
                    the core. That&apos;s why Copilot rode along as a plugin
                    while Cursor rebuilt the vehicle. The door out of this room
                    opened late in 2024, when models learned to reason —
                    multi-step thinking, the ingredient the next room was
                    waiting for.
                  </p>
                }
                era="Era II"
                expandLabel="Did you know? You were the bus."
                name="Extraction → Integration"
                reality="It answers now — in a browser tab, a world away from your code. You ferry context in and answers out by hand, until the chat moves into the editor and your selection becomes its context. Either way the verdict held: a senior engineer was faster. The model missed the file next door and the framework's basics, and correcting it cost more than writing it."
                vibe="guarded fascination"
                years="2022–2024"
              >
                <Era2Extraction />
                <Era2Companion />
              </EraPanel>
            )}
            {step === "era-3" && (
              <EraPanel
                deepCut={
                  <p>
                    Here&apos;s the part that should reframe everything: I
                    didn&apos;t build the harness myself. The agent built its
                    own auditor; I set its rules. A page that used to take hours
                    of manual diffing came in at 2–3 hours of the agent working
                    a list I never had to touch — about a week of work I
                    didn&apos;t do.
                  </p>
                }
                era="Era III"
                expandLabel="Did you know? I didn't build the harness either."
                name="Agentic engineering"
                reality="Strip the debate away: an agent is an LLM with tools, trapped in a loop. Claude Code put that loop in a terminal — barely useful at first, even on the strongest coding models. Then the loop learned to run longer; minutes became hours. You stop writing syntax and start writing the rules the loop must satisfy."
                vibe="the trust pivot"
                years="2024 → now"
              >
                <Era3Loop />
                <Era3Harness />
                <Era3Ladder />
                <Era3Pipeline />
                <Era3Meter />
              </EraPanel>
            )}
            {step === "era-4" && (
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
                era="Outlook"
                expandLabel="Did you know? That dashboard didn't exist a second ago."
                name="The runtime frontier"
                reality="An honest label: this is not a room the story's hero lives in. Everything so far was about empowering one engineer. This is the model crossing out of the build phase into the runtime itself — interfaces compiled from questions, code as a just-in-time byproduct. Not our era. The next frontier."
                vibe="the next frontier"
                years="2026 →"
              >
                <Era4Runtime />
              </EraPanel>
            )}
            {step === "synthesis" && <Synthesis />}
          </motion.div>
        </AnimatePresence>
      </main>
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
    </div>
  );
}

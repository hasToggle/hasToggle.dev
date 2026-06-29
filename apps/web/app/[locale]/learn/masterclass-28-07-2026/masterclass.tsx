"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { StepperHeader } from "./stepper-header";
import { getAdjacentStep, STEPS, type StepId } from "./steps";
import { Intro } from "./intro";
import { Synthesis } from "./synthesis";
import { EraPanel } from "./era-panel";
import { Era1Playground } from "./demos/era1-playground";

const STEP_IDS = STEPS.map((s) => s.id);

export function Masterclass() {
	const [step, setStep] = useQueryState(
		"step",
		parseAsStringLiteral(STEP_IDS as StepId[])
			.withDefault("intro")
			.withOptions({ history: "push" }),
	);

	const prev = getAdjacentStep(step, "prev");
	const next = getAdjacentStep(step, "next");

	return (
		<div className="flex min-h-dvh flex-col">
			<StepperHeader current={step} onSelect={setStep} />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
				{step === "intro" && <Intro onBegin={() => setStep("era-1")} />}
				{step === "era-1" && (
          <EraPanel
            deepCut={
              <p>
                There was no intent model here — only continuation. You
                weren&apos;t asking; you were seeding a pattern and hoping. That
                unpredictability is exactly why it read as a neat trick, not a
                tool.
              </p>
            }
            era="Era I"
            expandLabel="Did you know? It was never listening."
            name="Raw pattern matching"
            reality="You can't ask it anything. You feed it the start of a pattern and it continues — unaware of what you meant, and rarely twice the same way."
            vibe="skepticism"
            years="2019–2021"
          >
            <Era1Playground />
          </EraPanel>
        )}
				{step === "era-2" && <Era2Placeholder />}
				{step === "era-3" && <Era3Placeholder />}
				{step === "era-4" && <Era4Placeholder />}
				{step === "synthesis" && <Synthesis />}
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

function Era2Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 2 demo</p>;
}
function Era3Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 3 demo</p>;
}
function Era4Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 4 demo</p>;
}

"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { StepperHeader } from "./stepper-header";
import { getAdjacentStep, STEPS, type StepId } from "./steps";

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
				{/* Step bodies wired in later tasks */}
				<p className="font-mono text-muted-foreground text-sm">step: {step}</p>
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

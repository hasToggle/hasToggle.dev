"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { StepperHeader } from "./stepper-header";
import { getAdjacentStep, STEPS, type StepId } from "./steps";
import { Intro } from "./intro";
import { Synthesis } from "./synthesis";
import { EraPanel } from "./era-panel";
import { Era1Playground } from "./demos/era1-playground";
import { Era2Companion } from "./demos/era2-companion";
import { Era3Harness } from "./demos/era3-harness";
import { Era3Ladder } from "./demos/era3-ladder";
import { Era3Pipeline } from "./demos/era3-pipeline";
import { Era4Runtime } from "./demos/era4-runtime";
import { FieldNote } from "./field-note";

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
						{step === "era-2" && (
							<EraPanel
								deepCut={
									<p>
										The speed was real, and so was the ceiling: the model saw one
										file, one selection. You held absolute, manual control — and
										paid for it in copy-paste and context you carried in your head.
									</p>
								}
								era="Era II"
								expandLabel="Did you know? You were the bus."
								name="Conversational companions"
								reality="It can talk now — but it's localized. It sees one file, has no repo awareness, and nothing reaches your code until you move it. You are the integration layer."
								vibe="guarded fascination"
								years="2021–2023"
							>
								<Era2Companion />
							</EraPanel>
						)}
						{step === "era-3" && (
							<EraPanel
								deepCut={
									<p>
										Here&apos;s the part that should reframe everything: I
										didn&apos;t build the harness myself. The agent built its own
										auditor; I set its rules. A page that used to take hours of
										manual diffing came in at 2–3 hours of the agent working a list
										I never had to touch — about a week of work I didn&apos;t do.
									</p>
								}
								era="Era III"
								expandLabel="Did you know? I didn't build the harness either."
								name="Systems-driven agentic engineering"
								reality="You stop writing syntax and start writing the rules. The agent reads the repo, runs the loop, audits itself against your spec, and self-corrects. You realize you're the bottleneck — and you learn to get out of the way."
								vibe="the trust pivot"
								years="2024–2025"
							>
								<Era3Harness />
								<Era3Ladder />
								<Era3Pipeline />
								<FieldNote date="2026-07">
									I say hi to the agent at seven sharp. Not to be polite — the
									five-hour meter starts when I do. Some days the window burns
									out by ten, and I spend two hours waiting for my own tools to
									let me back in.
								</FieldNote>
							</EraPanel>
						)}
						{step === "era-4" && (
							<EraPanel
								deepCut={
									<p>
										The dashboard you just watched assemble is json-render under the
										hood — a spec the model emits and the page compiles at runtime.
										The same engine lets an end user build their own UI without a
										developer in the loop. Code stops being a permanent artifact and
										becomes a byproduct of intent.
									</p>
								}
								era="Era IV"
								expandLabel="Did you know? That dashboard didn't exist a second ago."
								name="The runtime-driven, AI-native horizon"
								reality="The model moves past the build phase into the runtime boundary. Ask a question and the interface is compiled on the fly — code as an ephemeral, just-in-time byproduct of what you wanted to see."
								vibe="architectural liberation"
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

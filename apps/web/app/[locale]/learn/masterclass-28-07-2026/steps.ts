export type StepId =
	| "intro"
	| "era-1"
	| "era-2"
	| "era-3"
	| "era-4"
	| "synthesis";

export interface Step {
	id: StepId;
	label: string;
	era?: string;
	vibe?: string;
}

export const STEPS: readonly Step[] = [
	{ id: "intro", label: "Intro" },
	{ id: "era-1", label: "I · Completion", era: "Era I", vibe: "skepticism" },
	{
		id: "era-2",
		label: "II · Companion",
		era: "Era II",
		vibe: "guarded fascination",
	},
	{
		id: "era-3",
		label: "III · Agent",
		era: "Era III",
		vibe: "the trust pivot",
	},
	{
		id: "era-4",
		label: "IV · Runtime",
		era: "Era IV",
		vibe: "architectural liberation",
	},
	{ id: "synthesis", label: "Synthesis" },
] as const;

const IDS = STEPS.map((s) => s.id);

export function isStepId(value: string): value is StepId {
	return (IDS as string[]).includes(value);
}

export function getStepIndex(id: StepId): number {
	return IDS.indexOf(id);
}

export function getAdjacentStep(
	id: StepId,
	dir: "prev" | "next",
): StepId | null {
	const next = getStepIndex(id) + (dir === "next" ? 1 : -1);
	return STEPS[next]?.id ?? null;
}

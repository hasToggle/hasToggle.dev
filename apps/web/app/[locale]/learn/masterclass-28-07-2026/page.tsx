import type { Metadata } from "next";
import { Masterclass } from "./masterclass";

export const metadata: Metadata = {
	title: "The Four Eras of Developer–AI Interaction — Masterclass",
	description:
		"An interactive walk through how developer–AI interaction evolved — and how the developer's role transformed with it.",
	robots: { index: false, follow: false },
};

export default function MasterclassPage() {
	return <Masterclass />;
}

import type { Metadata } from "next";
import { Masterclass } from "./masterclass";

export const metadata: Metadata = {
  description:
    "An interactive walk through how developer–AI interaction evolved — and how the developer's role transformed with it.",
  robots: { follow: false, index: false },
  title: "The Four Eras of Developer–AI Interaction — Masterclass",
};

export default function MasterclassPage() {
  return <Masterclass />;
}

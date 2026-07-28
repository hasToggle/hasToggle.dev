import type { Metadata } from "next";
import { Masterclass } from "./masterclass";

export const metadata: Metadata = {
  description:
    "Agentic engineering, recounted as lived experience — against the history of how the models grew up and how engineers' minds had to move.",
  robots: { follow: false, index: false },
  title: "Agentic Engineering — A Masterclass",
};

export default function MasterclassPage() {
  return <Masterclass />;
}

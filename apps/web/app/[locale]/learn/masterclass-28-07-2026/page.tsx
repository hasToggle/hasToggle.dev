import type { Metadata } from "next";
import { Suspense } from "react";
import { Masterclass } from "./masterclass";

export const metadata: Metadata = {
  description:
    "Agentic engineering, recounted as lived experience — against the history of how the models grew up and how engineers' minds had to move.",
  robots: { follow: false, index: false },
  title: "Agentic Engineering — A Masterclass",
};

export default function MasterclassPage() {
  return (
    // The exhibit reads its step from the URL (nuqs), which is runtime data
    // under Cache Components — so it renders inside a Suspense boundary.
    <Suspense fallback={null}>
      <Masterclass />
    </Suspense>
  );
}

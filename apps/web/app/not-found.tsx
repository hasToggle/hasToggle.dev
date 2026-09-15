import type { Metadata } from "next";
import { NotFoundPage } from "./[locale]/components/not-found-page";

export const metadata: Metadata = {
  title: "Not found — hasToggle",
};

// Outside the locale layout, so it wears that layout's one class itself.
export default function NotFound() {
  return (
    <div className="font-switzer selection:bg-ht-cyan-400/30">
      <NotFoundPage />
    </div>
  );
}

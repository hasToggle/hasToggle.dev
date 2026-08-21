import type { ReactNode } from "react";
import { Footer } from "../components/footer";

interface LegalLayoutProps {
  children: ReactNode;
}

// The footer rides along so the legal pages are not dead ends — the
// imprint/privacy links must stay reachable from here too.
const LegalLayout = ({ children }: LegalLayoutProps) => (
  <>
    {children}
    <Footer />
  </>
);

export default LegalLayout;

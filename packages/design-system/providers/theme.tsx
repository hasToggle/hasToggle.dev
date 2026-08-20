import type { ThemeProviderProps } from "next-themes";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

// Handed on so consumers read the theme through the same module instance that
// provides it. next-themes keeps its context in module scope, and an app that
// depended on next-themes directly could resolve a second copy whose context
// is permanently empty. Bound to a const rather than re-exported with
// `export ... from`, which reads as a barrel file to the linter.
export const useTheme = useNextTheme;

export const ThemeProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
    {...properties}
  >
    {children}
  </NextThemeProvider>
);

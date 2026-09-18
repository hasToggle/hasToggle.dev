import { cn } from "@repo/design-system/lib/utils";

type HeadingProps = {
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.ComponentPropsWithoutRef<
  "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
>;

export function Heading({
  className,
  as: Element = "h2",
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      className={cn(
        "text-pretty font-medium text-4xl text-foreground tracking-tighter sm:text-6xl",
        className
      )}
    />
  );
}

export function Subheading({
  className,
  as: Element = "h2",
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      className={cn(
        "font-mono font-semibold text-muted-foreground text-xs/5 uppercase tracking-widest",
        className
      )}
    />
  );
}

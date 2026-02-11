import { cn } from "@repo/design-system/lib/utils";

type HeadingProps = {
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  dark?: boolean;
} & React.ComponentPropsWithoutRef<
  "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
>;

export function Heading({
  className,
  as: Element = "h2",
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      className={cn(
        className,
        "text-pretty font-medium text-4xl text-gray-950 tracking-tighter data-[dark]:text-white sm:text-6xl"
      )}
      data-dark={dark ? "true" : undefined}
    />
  );
}

export function Subheading({
  className,
  as: Element = "h2",
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      className={cn(
        className,
        "font-mono font-semibold text-gray-500 text-xs/5 uppercase tracking-widest data-[dark]:text-gray-400"
      )}
      data-dark={dark ? "true" : undefined}
    />
  );
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(className, "font-medium text-2xl text-gray-500")}
      {...props}
    />
  );
}

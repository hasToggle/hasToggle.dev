import { cn } from "@repo/design-system/lib/utils";
import NextLink from "next/link";

const variants = {
  outline: cn(
    "inline-flex items-center justify-center px-2 py-[calc(0.375rem-1px)]",
    "rounded-lg border border-transparent shadow ring-1 ring-border",
    "whitespace-nowrap font-medium text-foreground text-sm",
    "hover:bg-muted disabled:bg-transparent disabled:opacity-40"
  ),
  primary: cn(
    "inline-flex items-center justify-center px-4 py-[calc(0.5rem-1px)]",
    "rounded-full border border-transparent bg-primary shadow-md",
    "whitespace-nowrap font-medium text-base text-primary-foreground",
    "transition-colors duration-200 hover:bg-primary/90 disabled:opacity-40"
  ),
};

type MarketingButtonProps = {
  variant?: keyof typeof variants;
  className?: string;
  href?: string;
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
);

export function MarketingButton({
  variant = "primary",
  className,
  href,
  ...props
}: MarketingButtonProps) {
  // Caller classes last, so a caller can override the variant (the
  // armed deck step recolors the outline variant's ring, for one).
  const combinedClassName = cn(variants[variant], className);

  if (href) {
    return (
      <NextLink
        className={combinedClassName}
        href={href}
        {...(props as React.ComponentPropsWithoutRef<"a">)}
      />
    );
  }

  return (
    <button
      className={combinedClassName}
      type="button"
      {...(props as React.ComponentPropsWithoutRef<"button">)}
    />
  );
}

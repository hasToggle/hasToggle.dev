import { cn } from "@repo/design-system/lib/utils";
import NextLink from "next/link";

const variants = {
  primary: cn(
    "inline-flex items-center justify-center px-4 py-[calc(0.5rem-1px)]",
    "rounded-full border border-transparent bg-gray-950 shadow-md",
    "whitespace-nowrap font-medium text-base text-white",
    "hover:bg-gray-800 disabled:bg-gray-950 disabled:opacity-40"
  ),
  secondary: cn(
    "relative inline-flex items-center justify-center px-4 py-[calc(0.5rem-1px)]",
    "rounded-full border border-transparent bg-white/90 shadow-md ring-1 ring-[#29a8fe]/15",
    "after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]",
    "whitespace-nowrap font-medium text-base text-slate-950",
    "hover:bg-white disabled:bg-white/70 disabled:opacity-50"
  ),
  outline: cn(
    "inline-flex items-center justify-center px-2 py-[calc(0.375rem-1px)]",
    "rounded-lg border border-transparent shadow ring-1 ring-black/10",
    "whitespace-nowrap font-medium text-gray-950 text-sm",
    "hover:bg-gray-50 disabled:bg-transparent disabled:opacity-40"
  ),
  white: cn(
    "mt-4 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 font-semibold text-base",
    "border border-transparent text-ht-blue-700 tracking-tight shadow-sm hover:text-ht-blue-800 focus:outline-none",
    "focus-visible:text-ht-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-white active:bg-blue-50 active:text-ht-blue-900/80 disabled:opacity-70",
    "disabled:cursor-not-allowed disabled:hover:text-ht-blue-700 sm:relative sm:z-10 sm:mt-0 sm:flex-none"
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
  const combinedClassName = cn(className, variants[variant]);

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

import { cn } from "@repo/design-system/lib/utils";

type ColorVariant = "light" | "dark";

export function PlusGrid({
  className = "",
  children,
}: {
  className?: string;
  variant?: ColorVariant;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

export function PlusGridRow({
  className = "",
  variant = "light",
  children,
}: {
  className?: string;
  variant?: ColorVariant;
  children: React.ReactNode;
}) {
  const borderColor =
    variant === "light" ? "border-black/5" : "border-white/10";

  return (
    <div
      className={cn(
        className,
        "group/row relative isolate pt-[calc(0.5rem+1px)] last:pb-[calc(0.5rem+1px)]"
      )}
    >
      <div
        aria-hidden="true"
        className="-z-10 -translate-x-1/2 absolute inset-y-0 left-1/2 w-screen"
      >
        <div className={cn("absolute inset-x-0 top-0 border-t", borderColor)} />
        <div className={cn("absolute inset-x-0 top-2 border-t", borderColor)} />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 hidden border-b group-last/row:block",
            borderColor
          )}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-2 hidden border-b group-last/row:block",
            borderColor
          )}
        />
      </div>
      {children}
    </div>
  );
}

export function PlusGridItem({
  className = "",
  variant = "light",
  children,
}: {
  className?: string;
  variant?: ColorVariant;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(className, "group/item relative")}>
      <PlusGridIcon
        className="hidden group-first/item:block"
        placement="top left"
        variant={variant}
      />
      <PlusGridIcon placement="top right" variant={variant} />
      <PlusGridIcon
        className="hidden group-last/row:group-first/item:block"
        placement="bottom left"
        variant={variant}
      />
      <PlusGridIcon
        className="hidden group-last/row:block"
        placement="bottom right"
        variant={variant}
      />
      {children}
    </div>
  );
}

export function PlusGridIcon({
  className = "",
  variant = "light",
  placement,
}: {
  className?: string;
  variant?: ColorVariant;
  placement: `${"top" | "bottom"} ${"right" | "left"}`;
}) {
  const [yAxis, xAxis] = placement.split(" ");
  const yClass = yAxis === "top" ? "-top-2" : "-bottom-2";
  const xClass = xAxis === "left" ? "-left-2" : "-right-2";
  const fillColor = variant === "light" ? "fill-black/10" : "fill-white/20";

  return (
    <svg
      aria-hidden="true"
      className={cn(
        className,
        "absolute size-[15px]",
        fillColor,
        yClass,
        xClass
      )}
      viewBox="0 0 15 15"
    >
      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
    </svg>
  );
}

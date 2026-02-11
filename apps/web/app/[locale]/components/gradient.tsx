import { cn } from "@repo/design-system/lib/utils";

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "bg-linear-[115deg] from-[29%] from-gray-900 via-[76%] via-ht-blue-400 to-ht-blue-400/80 sm:bg-linear-[145deg]"
      )}
    />
  );
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={cn(
          "-right-60 -top-44 absolute h-60 w-[36rem] transform-gpu md:right-0",
          "bg-linear-[115deg] from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff]",
          "rotate-[-10deg] rounded-full blur-3xl"
        )}
      />
    </div>
  );
}

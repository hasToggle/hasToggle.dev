import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";

export function Screenshot({
  width,
  height,
  src,
  className,
}: {
  width: number;
  height: number;
  src: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "relative aspect-[var(--width)/var(--height)] [--radius:0.75rem]"
      )}
      style={{ "--width": width, "--height": height } as React.CSSProperties}
    >
      <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:0.5rem]" />
      <Image
        alt=""
        className="h-full rounded-[var(--radius)] shadow-2xl ring-1 ring-black/10"
        height={height}
        src={src}
        width={width}
      />
    </div>
  );
}

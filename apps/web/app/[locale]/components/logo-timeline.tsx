import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[length:12px_100%] bg-gradient-to-r from-[2px] from-white/15 to-[2px]" />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[length:12px_100%] bg-gradient-to-r from-[2px] from-white/5 to-[2px] group-last:hidden" />
      {children}
    </div>
  );
}

function Logo({
  label,
  src,
  className,
}: {
  label: string;
  src: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        className,
        "absolute top-2 flex items-center gap-2 whitespace-nowrap px-3 py-1",
        "inset-ring inset-ring-white/10 rounded-full bg-gradient-to-t from-50% from-gray-800 to-gray-700",
        "[--move-x-from:-100%] [--move-x-to:calc(100%+100cqw)] [animation-iteration-count:infinite] [animation-name:move-x] [animation-play-state:paused] [animation-timing-function:linear] group-hover:[animation-play-state:running]"
      )}
    >
      <Image
        alt=""
        className="size-4 shrink-0"
        height={16}
        src={src}
        width={16}
      />
      <span className="font-medium text-sm/6 text-white">{label}</span>
    </div>
  );
}

export function LogoTimeline() {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden">
      <div className="absolute inset-0 top-8 z-10 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            maskImage: `url('data:image/svg+xml,<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="12" fill="black"/></svg>')`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
          }}
        />
        <div className="relative inset-ring inset-ring-white/10 flex size-24 items-center justify-center rounded-xl bg-gradient-to-t from-white/5 to-white/25 shadow outline outline-white/5 outline-offset-[-5px]">
          <Image
            alt="hasToggle"
            className="h-[52px] w-[39px] rounded-md"
            height={52}
            src="/logo.png"
            width={39}
          />
        </div>
      </div>
      <div className="absolute inset-0 grid grid-cols-1 pt-8 [container-type:inline-size]">
        <Row>
          <Logo
            className="[animation-delay:-26s] [animation-duration:30s]"
            label="HTML"
            src="/logo-timeline/html.svg"
          />
          <Logo
            className="[animation-delay:-8s] [animation-duration:30s]"
            label="CSS"
            src="/logo-timeline/css.svg"
          />
        </Row>
        <Row>
          <Logo
            className="[animation-delay:-40s] [animation-duration:40s]"
            label="JavaScript"
            src="/logo-timeline/javascript.svg"
          />
          <Logo
            className="[animation-delay:-20s] [animation-duration:40s]"
            label="React"
            src="/logo-timeline/react.svg"
          />
        </Row>
        <Row>
          <Logo
            className="[animation-delay:-10s] [animation-duration:40s]"
            label="Next.js"
            src="/logo-timeline/nextjs.svg"
          />
          <Logo
            className="[animation-delay:-32s] [animation-duration:40s]"
            label="Tailwind CSS"
            src="/logo-timeline/tailwindcss.svg"
          />
        </Row>
        <Row>
          <Logo
            className="[animation-delay:-45s] [animation-duration:45s]"
            label="TypeScript"
            src="/logo-timeline/typescript.svg"
          />
          <Logo
            className="[animation-delay:-23s] [animation-duration:45s]"
            label="PostgreSQL"
            src="/logo-timeline/postgresql.svg"
          />
        </Row>
        <Row>
          <Logo
            className="[animation-delay:-55s] [animation-duration:60s]"
            label="MongoDB"
            src="/logo-timeline/mongodb.svg"
          />
          <Logo
            className="[animation-delay:-20s] [animation-duration:60s]"
            label="Node.js"
            src="/logo-timeline/nodejs.svg"
          />
        </Row>
        <Row>
          <Logo
            className="[animation-delay:-9s] [animation-duration:40s]"
            label="State Management"
            src="/logo-timeline/state-management.svg"
          />
          <Logo
            className="[animation-delay:-28s] [animation-duration:40s]"
            label="SSR"
            src="/logo-timeline/ssr.svg"
          />
        </Row>
      </div>
    </div>
  );
}

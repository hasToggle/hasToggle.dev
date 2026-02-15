import { cn } from "@repo/design-system/lib/utils";

export const SkeletonCode = ({ isLoading }: { isLoading?: boolean }) => (
  <div
    className={cn(
      "my-auto h-60 rounded-2xl bg-gray-900/80 p-4 sm:h-[18rem] lg:h-[20rem]",
      {
        "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
          isLoading,
      }
    )}
  >
    <div className="space-y-2.5">
      <div className="h-4 w-6/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-9/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-3/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-3/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-9/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-12/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-2/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-4/12 rounded-lg bg-gray-700 lg:h-6" />
      <div className="h-4 w-3/12 rounded-lg bg-gray-700 lg:h-6" />
    </div>
  </div>
);

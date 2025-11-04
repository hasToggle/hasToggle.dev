"use client";

import { useOthers, useSelf } from "@repo/collaboration/hooks";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";

type PresenceAvatarProps = {
  info?: Liveblocks["UserMeta"]["info"];
};

const PresenceAvatar = ({ info }: PresenceAvatarProps) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger>
      <Avatar className="h-7 w-7 bg-secondary ring-1 ring-background">
        <AvatarImage alt={info?.name} src={info?.avatar} />
        <AvatarFallback className="text-xs">
          {info?.name?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </TooltipTrigger>
    <TooltipContent collisionPadding={4}>
      <p>{info?.name ?? "Unknown"}</p>
    </TooltipContent>
  </Tooltip>
);

/**
 * Maximum number of individual avatars to display before showing "+N" indicator
 */
const MAX_VISIBLE_AVATARS = 3;

export const AvatarStack = () => {
  const others = useOthers();
  const self = useSelf();
  const hasMoreUsers = others.length > MAX_VISIBLE_AVATARS;

  return (
    <div className="-space-x-1 flex items-center px-4">
      {others.slice(0, MAX_VISIBLE_AVATARS).map(({ connectionId, info }) => (
        <PresenceAvatar info={info} key={connectionId} />
      ))}

      {hasMoreUsers && (
        <PresenceAvatar
          info={{
            name: `+${others.length - MAX_VISIBLE_AVATARS}`,
            color: "var(--color-muted-foreground)",
          }}
        />
      )}

      {self && <PresenceAvatar info={self.info} />}
    </div>
  );
};

import { analytics } from "@repo/analytics/server";
import { auth } from "@repo/auth/server";
import { flag } from "flags/next";

export const createFlag = (key: string, description?: string) =>
  flag({
    async decide() {
      const { userId } = await auth();

      if (!userId) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
    defaultValue: false,
    description,
    key,
    options: [
      { label: "On", value: true },
      { label: "Off", value: false },
    ],
  });

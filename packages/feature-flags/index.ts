import { createFlag } from "./lib/create-flag";

export const showBetaFeature = createFlag(
  "showBetaFeature",
  "Shows beta features to opted-in users"
);

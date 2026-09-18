import {
  initializeSentry,
  onRequestError as reportRequestError,
} from "@repo/observability/instrumentation";

export const register = initializeSentry;

// Next reads this export by name: every error its server catches lands here.
export const onRequestError = reportRequestError;

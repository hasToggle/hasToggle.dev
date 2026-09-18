/*
 * How much of what happens is sent to Sentry, shared by the server, edge and
 * browser setups. Errors are not sampled — every one is reported. These two
 * only bound the rest, which on a small plan is what runs out first.
 */

// One request in ten is traced. At 1 every page view and API call is a
// transaction, which buys nothing an error report doesn't already carry.
export const TRACES_SAMPLE_RATE = 0.1;

// `console.log` stays out: it is development chatter, and forwarding it
// made every stray log line a billable Sentry log.
export const CONSOLE_LOG_LEVELS: ("error" | "warn")[] = ["error", "warn"];

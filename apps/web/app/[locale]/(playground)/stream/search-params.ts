import {
  createLoader,
  createParser,
  createSerializer,
  parseAsStringLiteral,
} from "nuqs/server";
import { parseRunId } from "./parse-run-id";
import { DEFAULT_STRATEGY, STRATEGY_ORDER } from "./strategy";

/**
 * The two params this exhibit keeps in the URL, declared once for both
 * sides: the server loads them off the page's searchParams and the panel
 * serializes them into the URL it navigates to. One definition, so the
 * arrangement the panel asks for and the one the stage runs can never be
 * parsed apart.
 *
 * No `useQueryStates` in the panel: it reads `useSearchParams()`, which
 * would need a Suspense boundary and pull the whole panel out of the
 * static shell. The shell shipping first is what this chapter shows.
 */
export const streamSearchParams = {
  mode: parseAsStringLiteral(STRATEGY_ORDER).withDefault(DEFAULT_STRATEGY),
  stream: createParser({
    parse: parseRunId,
    serialize: String,
  }).withDefault(0),
};

export const loadStreamSearchParams = createLoader(streamSearchParams);

/** Both params are always written, even at their defaults: a run is a run. */
export const streamHref = createSerializer(streamSearchParams, {
  clearOnDefault: false,
});

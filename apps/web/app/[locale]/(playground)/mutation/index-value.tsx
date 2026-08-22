import { cookies } from "next/headers";
import { COUNT_COOKIE, parseCount } from "./count-parser";

/**
 * The mutation chapter's reading on the contents page. It reads your
 * cookie, so it says so — the count is per visitor, and an index row
 * claiming a global number would be the page's first lie.
 */
export async function MutationIndexValue() {
  const jar = await cookies();
  const count = parseCount(jar.get(COUNT_COOKIE)?.value);

  return (
    <span>
      your presses · <span className="tabular-nums">{count}</span>
    </span>
  );
}

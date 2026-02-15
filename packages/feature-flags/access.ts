import { type ApiData, verifyAccess } from "flags";
import { NextResponse } from "next/server";
// biome-ignore lint/performance/noNamespaceImport: Namespace import needed to iterate over all flag definitions
import * as flags from "./index";

export const getFlags = async (request: Request): Promise<Response> => {
  const access = await verifyAccess(request.headers.get("Authorization"));

  if (!access) {
    return NextResponse.json(null, { status: 401 });
  }

  const definitions = Object.fromEntries(
    Object.values(flags).map((flag) => [
      flag.key,
      {
        origin: flag.origin,
        description: flag.description,
        options: flag.options,
      },
    ])
  );

  return NextResponse.json<ApiData>({
    definitions,
  });
};

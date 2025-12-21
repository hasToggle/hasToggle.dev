import { getFlags } from "@repo/feature-flags/access";

export const GET = (request: Request): Promise<Response> =>
  getFlags(request as Parameters<typeof getFlags>[0]);

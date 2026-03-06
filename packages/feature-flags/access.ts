import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
// biome-ignore lint/performance/noNamespaceImport: Namespace import needed to iterate over all flag definitions
import * as flags from "./index";

export const getFlags = createFlagsDiscoveryEndpoint(() =>
  getProviderData(flags)
);

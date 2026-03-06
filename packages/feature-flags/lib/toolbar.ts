import { keys } from "../keys";

export const withToolbar = async (config: object) => {
  if (keys().FLAGS_SECRET) {
    const { withVercelToolbar } = await import("@vercel/toolbar/plugins/next");
    return withVercelToolbar()(config);
  }
  return config;
};

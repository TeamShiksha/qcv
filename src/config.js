import packageJson from "../package.json" with { type: "json" };

export const DEFAULT_API_BASE_URL = "https://api.q.cv/v1";
export const CLI_VERSION = packageJson.version;

export function resolveApiBaseUrl(options = {}) {
  return options.apiBaseUrl || process.env.QCV_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function resolveToken() {
  return process.env.QCV_TOKEN || null;
}

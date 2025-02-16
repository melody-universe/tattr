import type { Config } from "drizzle-kit";

import { env } from "process";

export default {
  dbCredentials: {
    accountId: getRequiredEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID"),
    databaseId: "c1edd7fa-93c9-4cf0-99cc-801112ee1eea",
    token: getRequiredEnvironmentVariable("CLOUDFLARE_TOKEN"),
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./drizzle",
  schema: "./database/schema.ts",
} satisfies Config;

function getRequiredEnvironmentVariable(name: string) {
  const value = env[name];

  if (!value) {
    throw new Error(`Expected environment variable: ${name}`);
  }

  return value;
}

import type { Config } from "drizzle-kit";
import { env } from "process";

export default {
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    databaseId: "your-database-id",
    accountId: getRequiredEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID"),
    token: getRequiredEnvironmentVariable("CLOUDFLARE_TOKEN"),
  },
} satisfies Config;

function getRequiredEnvironmentVariable(name: string) {
  const value = env[name];

  if (!value) {
    throw new Error(`Expected environment variable: ${name}`);
  }

  return value;
}

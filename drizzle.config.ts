import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    accountId: "2bcbef515e72375efa7e408eeb8d183a",
    databaseId: "c1edd7fa-93c9-4cf0-99cc-801112ee1eea",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./drizzle",
  schema: "./database/schema.ts",
} satisfies Config;

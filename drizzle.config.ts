import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    accountId: "2bcbef515e72375efa7e408eeb8d183a",
    databaseId: "64e85594-e8ee-4e02-88b8-0c821b67ae63",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./drizzle",
  schema: "./database/schema.ts",
} satisfies Config;

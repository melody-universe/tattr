import type { ExecutionContext } from "@cloudflare/workers-types";
import type { AppLoadContext } from "react-router";

// NOTE: I want to drop the guest book table and don't have any other data to
// introduce at the moment, but will be adding some soon. Keeping data-related
// code commented to easily re-add it later.

// import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

// import * as schema from "./database/schema";

export function getLoadContext({
  context,
}: GetLoadContextArgs): AppLoadContext {
  // const db = drizzle(context.cloudflare.env.DB, { schema });

  return {
    cloudflare: context.cloudflare,
    // db,
  };
}

type GetLoadContextArgs = {
  context: Pick<AppLoadContext, "cloudflare">;
  request: Request;
};

declare module "react-router" {
  // This needs to be an interface in order to merge properties:
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface AppLoadContext {
    cloudflare: {
      ctx: Omit<ExecutionContext, "props">;
      env: CloudflareEnvironment;
    };
    // db: DrizzleD1Database<typeof schema>;
  }
}

declare global {
  type CloudflareEnvironment = Env;
}

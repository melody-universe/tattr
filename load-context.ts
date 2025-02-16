import type { ExecutionContext } from "@cloudflare/workers-types";
import type { AppLoadContext } from "react-router";

import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./database/schema";

declare global {
  // We might need to use this for additional environment vairalbes later.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CloudflareEnvironment extends Env {}
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      ctx: Omit<ExecutionContext, "props">;
      env: CloudflareEnvironment;
    };
    db: DrizzleD1Database<typeof schema>;
  }
}

interface GetLoadContextArgs {
  context: Pick<AppLoadContext, "cloudflare">;
  request: Request;
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  const db = drizzle(context.cloudflare.env.DB, { schema });

  return {
    cloudflare: context.cloudflare,
    db,
  };
}

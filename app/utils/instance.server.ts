// This function is intended to serve as a closure around the AppLoadContext.

import type { AppLoadContext } from "react-router";

import { assets, users } from "~/database/schema";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function instance(context: AppLoadContext) {
  async function isNew(): Promise<boolean> {
    const result = await context.db
      .select({ id: users.id })
      .from(users)
      .limit(1);
    return result.length === 0;
  }

  async function reset(): Promise<void> {
    await context.db.delete(assets);
    await context.db.delete(users);
  }

  return { isNew, reset };
}

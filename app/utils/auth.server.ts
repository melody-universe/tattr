import type { AppLoadContext } from "react-router";

import bcrypt from "bcryptjs";
import { generateSillyPassword } from "silly-password-generator";

import { users } from "~/database/schema";

// This function is intended to serve as a closure around the AppLoadContext.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function auth(context: AppLoadContext) {
  async function createUser({
    email,
    login,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const password = generateSillyPassword();
    try {
      await context.db.insert(users).values({
        email,
        login,
        passwordHash: await bcrypt.hash(password, 10),
      });

      return { isSuccess: true, password };
    } catch (error) {
      return { error, isSuccess: false };
    }
  }

  type CreateUserRequest = {
    email: string;
    login: string;
  };

  type CreateUserResponse =
    | { error: unknown; isSuccess: false }
    | { isSuccess: true; password: string };

  async function isNewInstance(): Promise<boolean> {
    const result = await context.db
      .select({ id: users.id })
      .from(users)
      .limit(1);
    return result.length === 0;
  }

  return {
    createUser,
    isNewInstance,
  };
}

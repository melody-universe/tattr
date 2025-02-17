import type { AppLoadContext } from "react-router";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
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

  async function verifyCredentials({
    login,
    password,
  }: VerifyCredentialsRequest): Promise<VerifyCredentialsResponse> {
    const result = await context.db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.login, login));

    if (result.length === 0) {
      return { error: "Invalid username or password.", isSuccess: false };
    }

    const { id, passwordHash } = result[0];
    if (!(await bcrypt.compare(password, passwordHash))) {
      return { error: "Invalid username or password.", isSuccess: false };
    }

    return { isSuccess: true, userId: id };
  }

  type VerifyCredentialsRequest = { login: string; password: string };

  type VerifyCredentialsResponse =
    | { error: unknown; isSuccess: false }
    | { isSuccess: true; userId: number };

  return {
    createUser,
    isNewInstance,
    verifyCredentials,
  };
}

import type { AppLoadContext } from "react-router";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { generateSillyPassword } from "silly-password-generator";

import { users } from "~/database/schema";

import type { Failable } from "./types/Failable";

// This function is intended to serve as a closure around the AppLoadContext.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function auth(context: AppLoadContext) {
  async function createUser({
    email,
    username,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const password = generateSillyPassword();
    try {
      await context.db.insert(users).values({
        email,
        passwordHash: await bcrypt.hash(password, 10),
        username,
      });

      return { isSuccess: true, password };
    } catch (error) {
      return { error, isSuccess: false };
    }
  }

  type CreateUserRequest = {
    email: string;
    username: string;
  };

  type CreateUserResponse = Failable<{ password: string }>;

  async function isNewInstance(): Promise<boolean> {
    const result = await context.db
      .select({ id: users.id })
      .from(users)
      .limit(1);
    return result.length === 0;
  }

  async function verifyCredentials({
    password,
    username,
  }: VerifyCredentialsRequest): Promise<VerifyCredentialsResponse> {
    const result = await context.db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.username, username));

    if (result.length === 0) {
      return { error: "Invalid username or password.", isSuccess: false };
    }

    const { id, passwordHash } = result[0];
    if (!(await bcrypt.compare(password, passwordHash))) {
      return { error: "Invalid username or password.", isSuccess: false };
    }

    return { isSuccess: true, userId: id };
  }

  type VerifyCredentialsRequest = { password: string; username: string };

  type VerifyCredentialsResponse = Failable<{ userId: number }>;

  return {
    createUser,
    isNewInstance,
    verifyCredentials,
  };
}

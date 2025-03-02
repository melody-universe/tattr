import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { type AppLoadContext, redirect, type Session } from "react-router";
import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";

import type { Failure } from "~/utils/types/Fallible";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";
import { auth } from "~/utils/auth.server";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";
import { type Errors } from "~/utils/errors";
import { commitSession } from "~/utils/sessions.server";

export function useLoginFormValues(): [
  FormValues,
  Dispatch<SetStateAction<FormValues>>,
] {
  return useState<FormValues>({ password: "", username: "" });
}

export function Login({
  formValues,
  onChangeFormValues,
  onSubmit,
}: LoginProps): ReactNode {
  const { password, username } = formValues;
  const setUsername = createOnChangeForKey(onChangeFormValues, "username");
  const setPassword = createOnChangeForKey(onChangeFormValues, "password");

  const [errors, setErrors] = useState<Errors<FormValues>>({});

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const result = formSchema.safeParse(formValues);
        if (!result.success) {
          setErrors(
            Object.fromEntries(
              Object.entries(result.error.format()).map(([field, errors]) => [
                field,
                Array.isArray(errors)
                  ? errors.join("\n")
                  : errors._errors.join("\n"),
              ]),
            ) as Errors<FormValues>,
          );
        }

        onSubmit();
      }}
    >
      <Card>
        <p>
          You&apos;re free to play around. But if you want to save anything,
          you&apos;ll need to login.
        </p>
        <TextField
          onChange={setUsername}
          placeholder="Username"
          value={username}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
        <PasswordField
          onChange={setPassword}
          placeholder="Password"
          value={password}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <Button className="self-end" type="submit">
          Login
        </Button>
      </Card>
    </form>
  );
}

type LoginProps = {
  formValues: FormValues;
  onChangeFormValues: Dispatch<SetStateAction<FormValues>>;
  onSubmit: () => void;
};

export const login = serverOnly$(
  async (
    context: AppLoadContext,
    session: Session,
    formData: FormData,
  ): Promise<Failure | Response> => {
    const username = formData.get("username");
    const password = formData.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      return {
        error: "Please provide a username and password.",
        isSuccess: false,
      };
    }

    const result = await auth(context).verifyCredentials({
      password,
      username,
    });
    if (!result.isSuccess) {
      return result;
    }

    session.set("userId", result.userId);

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  },
);

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  password: z.string(),
  username: z
    .string()
    .min(3)
    .max(64)
    .regex(
      /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]*$/,
      "Usernames can only contain letters, numbers, and printable characters (!#$%&'*+-/=?^_`{|}~.).",
    )
    .regex(
      /^(?:(?:[^.]+\.?)*[^.]+)?$/,
      "Dots cannot be the first or last character of a username, and cannot appear consecutively.",
    ),
});

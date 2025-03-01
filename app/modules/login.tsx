import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { z } from "zod";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";

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

  return (
    <form
      onSubmit={(event) => {
        onSubmit();
        event.preventDefault();
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
        <PasswordField
          onChange={setPassword}
          placeholder="Password"
          value={password}
        />
        <Button className="self-end" type="submit">
          Login
        </Button>
      </Card>
    </form>
  );
}

export type LoginProps = {
  formValues: FormValues;
  onChangeFormValues: Dispatch<SetStateAction<FormValues>>;
  onSubmit: () => void;
};

type FormValues = z.infer<typeof formSchema>;

// Will come back and use this for validation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      /^(?:[^.]+\.?)*[^.]+$/,
      "Dots cannot be the first or last character of a username, and cannot appear consecutively.",
    ),
});

import { type ReactNode } from "react";
import { z } from "zod";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";
import {
  buildFormControllerHook,
  type FormController,
} from "~/utils/use-form-controller";

const schema = z.object({
  password: z.string(),
  username: z
    .string()
    .trim()
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

export const useLoginFormController = buildFormControllerHook(schema);

export function Login({
  controller: { errors, formValues, onSubmit: handleSubmit, setFormValues },
}: LoginProps): ReactNode {
  const { password, username } = formValues;
  const setUsername = createOnChangeForKey(setFormValues, "username");
  const setPassword = createOnChangeForKey(setFormValues, "password");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
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
        {errors?.username?._errors && (
          <p className="text-red-500">{errors.username._errors.join("\n")}</p>
        )}
        <PasswordField
          onChange={setPassword}
          placeholder="Password"
          value={password}
        />
        {errors?.password?._errors && (
          <p className="text-red-500">{errors.password._errors.join("\n")}</p>
        )}
        <Button className="self-end" type="submit">
          Login
        </Button>
      </Card>
    </form>
  );
}

type LoginProps = { controller: FormController<typeof schema> };

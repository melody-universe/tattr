import type { AppLoadContext } from "react-router";

import { Form } from "radix-ui";
import { type ReactNode } from "react";
import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import { zx } from "zodix";

import type { Fallible } from "~/utils/types/Fallible";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { EmailField } from "~/components/email-field";
import { TextField } from "~/components/text-field";
import { auth } from "~/utils/auth.server";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";
import { instance } from "~/utils/instance.server";
import { stringifyError } from "~/utils/stringify-error";
import {
  buildFormControllerHook,
  type FormController,
} from "~/utils/use-form-controller";

const schema = z.object({
  email: z.string().trim().email(),
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

export const useNewInstanceFormController = buildFormControllerHook(schema);

export function NewInstance({
  formController,
  password,
}: NewInstanceProps): ReactNode {
  if (password) {
    return (
      <Card>
        <p>Your user has been created. Your password is:</p>
        <pre className="text-wrap">{password}</pre>
      </Card>
    );
  }

  return <NewInstanceForm controller={formController} />;
}

export type NewInstanceProps = {
  formController: FormController<typeof schema>;
  password?: string;
};

function NewInstanceForm({
  controller: { errors, formValues, onSubmit: handleSubmit, setFormValues },
}: NewInstanceFormProps): ReactNode {
  const { email, username } = formValues;
  const setEmail = createOnChangeForKey(setFormValues, "email");
  const setUsername = createOnChangeForKey(setFormValues, "username");

  return (
    <Card>
      <p>
        It looks like this is a new instance of Tattr. Ready to get started?
      </p>
      {}
      <Form.Root
        className="space-y-4"
        onSubmit={(event) => {
          handleSubmit();
          event.preventDefault();
        }}
      >
        <Form.Field name="email">
          <Form.Label>Email</Form.Label>
          <Form.Control asChild>
            <EmailField onChange={setEmail} required value={email} />
          </Form.Control>
          {errors?.email?._errors.map((error, i) => (
            <Form.Message
              className="block text-red-800 dark:text-red-400"
              key={i}
            >
              {error}
            </Form.Message>
          ))}
        </Form.Field>
        <Form.Field name="username">
          <Form.Label>Username</Form.Label>
          <Form.Control asChild>
            <TextField onChange={setUsername} value={username} />
          </Form.Control>
          {errors?.username?._errors.map((error, i) => (
            <Form.Message
              className="block text-red-800 dark:text-red-400"
              key={i}
            >
              {error}
            </Form.Message>
          ))}
        </Form.Field>
        <Button className="self-end" type="submit">
          Let&apos;s go
        </Button>
      </Form.Root>
    </Card>
  );
}

type NewInstanceFormProps = {
  controller: FormController<typeof schema>;
};

export const newInstance = serverOnly$(
  async (
    context: AppLoadContext,
    formData: FormData,
  ): Promise<NewInstanceResult> => {
    const parseResult = await zx.parseFormSafe(formData, schema);
    if (!parseResult.success) {
      return { error: parseResult.error.format(), isSuccess: false };
    }

    const { email, username } = parseResult.data;

    try {
      if (!(await instance(context).isNew())) {
        return {
          error: "A user already exists in this instance.",
          isSuccess: false,
        };
      }

      const result = await auth(context).createUser({ email, username });
      if (!result.isSuccess) {
        throw result.error;
      }
      return {
        kind: "newInstance",
        isSuccess: true,
        password: result.password,
      };
    } catch (error: unknown) {
      return {
        error: stringifyError(error),
        isSuccess: false,
      };
    }
  },
);

export type NewInstanceResult = Fallible<{
  kind: "newInstance";
  password: string;
}>;

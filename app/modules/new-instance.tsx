import { Form } from "radix-ui";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { z } from "zod";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { EmailField } from "~/components/email-field";
import { TextField } from "~/components/text-field";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";

export function useNewInstanceFormValues(): [
  FormValues,
  Dispatch<SetStateAction<FormValues>>,
] {
  return useState<FormValues>({ email: "", username: "" });
}

export function NewInstance({
  password,
  ...newInstanceFormProps
}: NewInstanceProps): ReactNode {
  if (password) {
    return (
      <Card>
        <p>Your user has been created. Your password is:</p>
        <pre className="text-wrap">{password}</pre>
      </Card>
    );
  }

  return <NewInstanceForm {...newInstanceFormProps} />;
}

export type NewInstanceProps = NewInstanceFormProps & {
  password?: string;
};

function NewInstanceForm({
  formValues,
  onChangeFormValues,
  onSubmit,
}: NewInstanceFormProps): ReactNode {
  const { email, username } = formValues;
  const setEmail = createOnChangeForKey(onChangeFormValues, "email");
  const setUsername = createOnChangeForKey(onChangeFormValues, "username");

  return (
    <Card>
      <p>
        It looks like this is a new instance of Tattr. Ready to get started?
      </p>
      {}
      <Form.Root
        className="space-y-4"
        onSubmit={(event) => {
          onSubmit();
          event.preventDefault();
        }}
      >
        <Form.Field name="email">
          <Form.Label>Email</Form.Label>
          <Form.Control asChild>
            <EmailField onChange={setEmail} required value={email} />
          </Form.Control>
        </Form.Field>
        <Form.Field name="username">
          <Form.Label>Username</Form.Label>
          <Form.Control asChild>
            <TextField onChange={setUsername} value={username} />
          </Form.Control>
        </Form.Field>
        <Button className="self-end" type="submit">
          Let&apos;s go
        </Button>
      </Form.Root>
    </Card>
  );
}

type NewInstanceFormProps = {
  formValues: FormValues;
  onChangeFormValues: Dispatch<SetStateAction<FormValues>>;
  onSubmit: () => void;
};

type FormValues = z.infer<typeof formSchema>;

// Will come back and use this for validation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  email: z.string().email(),
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

import type { ReactNode } from "react";

import { Form } from "radix-ui";
import {
  type AppLoadContext,
  redirect,
  Form as RouterForm,
} from "react-router";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { SpamError } from "remix-utils/honeypot/server";
import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { EmailField } from "~/components/email-field";
import { TextField } from "~/components/text-field";
import { guests } from "~/database/schema";
import { createOnChangeForKey } from "~/utils/create-on-change-for-key";
import { honeypot } from "~/utils/honeypot.server";
import { stringifyError } from "~/utils/stringify-error";
import {
  buildFormControllerHook,
  type FormController,
} from "~/utils/use-form-controller";

const schema = z.object({ email: z.string().email(), name: z.string() });

export const useGuestbookFormController = buildFormControllerHook(schema);

export function Guestbook({
  controller: { errors, formValues, setFormValues },
}: GuestbookProps): ReactNode {
  const { email, name } = formValues;
  const setEmail = createOnChangeForKey(setFormValues, "email");
  const setName = createOnChangeForKey(setFormValues, "name");

  return (
    <Card>
      <p>
        Want to stay tuned and be contacted when this thing looks like
        what&apos;s in my head?
      </p>
      <Form.Root asChild className="space-y-4" method="post">
        <RouterForm>
          <HoneypotInputs />
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
          <Form.Field name="name">
            <Form.Label>Name</Form.Label>
            <Form.Control asChild>
              <TextField onChange={setName} required value={name} />
            </Form.Control>
            {errors?.name?._errors.map((error, i) => (
              <Form.Message
                className="block text-red-800 dark:text-red-400"
                key={i}
              >
                {error}
              </Form.Message>
            ))}
          </Form.Field>
          <Button className="self-end" type="submit">
            Good luck!
          </Button>
        </RouterForm>
      </Form.Root>
    </Card>
  );
}

type GuestbookProps = { controller: FormController<typeof schema> };

export const guestbook = serverOnly$(
  async (context: AppLoadContext, formData: FormData): Promise<Response> => {
    let isBot: boolean;
    try {
      await honeypot.check(formData);
      isBot = false;
    } catch (error) {
      if (error instanceof SpamError) {
        isBot = true;
      } else {
        console.error(stringifyError(error));
        return redirect("/");
      }
    }

    const { email, name } = await zx.parseForm(formData, schema);

    await context.db
      .insert(guests)
      .values({ email, isBot: isBot ? 1 : 0, name });

    return redirect("/");
  },
);

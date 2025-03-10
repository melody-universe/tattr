import type { ReactNode } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "radix-ui";
import { Form as ReactRouterForm, redirect, useSubmit } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";

import type { Failure, Fallible } from "~/utils/types/Fallible";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { EmailField } from "~/components/email-field";
import { Input } from "~/components/input";
import { PageLayout } from "~/components/page-layout";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";
import { auth } from "~/utils/auth.server";
import { instance } from "~/utils/instance.server";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/utils/sessions.server";
import { stringifyError } from "~/utils/stringify-error";

import type { Route } from "./+types/home";

export default function Home({
  actionData,
  loaderData,
}: Route.ComponentProps): ReactNode {
  const signInForm = useRemixForm({
    defaultValues: { intent: "signIn" },
    mode: "onSubmit",
    resolver: signInResolver,
  });

  const newInstanceForm = useRemixForm({
    defaultValues: { intent: "newInstance" },
    mode: "onSubmit",
    resolver: newInstanceResolver,
  });

  const submit = useSubmit();

  const { isLoggedIn, isNewInstance } = loaderData;
  const password = actionData?.isSuccess ? actionData.password : undefined;

  return (
    <PageLayout>
      <Card>
        Welcome to Tattr. This is a tool for managing crafts for tabletop
        role-playing games.
      </Card>

      {password && (
        <Card>
          <p>Your user has been created. Your password is:</p>
          <pre className="text-wrap">{password}</pre>
        </Card>
      )}

      {isNewInstance ? (
        <Card>
          <p>
            It looks like this is a new instance of Tattr. Ready to get started?
          </p>
          <Form.Root asChild>
            <ReactRouterForm
              className="space-y-4"
              method="post"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={newInstanceForm.handleSubmit}
            >
              <Input type="hidden" {...newInstanceForm.register("intent")} />
              <Form.Field name="email">
                <Form.Label>Email</Form.Label>
                <Form.Control asChild>
                  <EmailField required {...newInstanceForm.register("email")} />
                </Form.Control>
                {newInstanceForm.formState.errors.email?.message && (
                  <Form.Message className="block text-red-800 dark:text-red-400">
                    {newInstanceForm.formState.errors.email.message}
                  </Form.Message>
                )}
              </Form.Field>
              <Form.Field name="username">
                <Form.Label>Username</Form.Label>
                <Form.Control asChild>
                  <TextField {...newInstanceForm.register("username")} />
                </Form.Control>
                {newInstanceForm.formState.errors.username?.message && (
                  <Form.Message className="block text-red-800 dark:text-red-400">
                    {newInstanceForm.formState.errors.username.message}
                  </Form.Message>
                )}
              </Form.Field>
              <Button className="self-end" type="submit">
                Let&apos;s go
              </Button>
            </ReactRouterForm>
          </Form.Root>
        </Card>
      ) : isLoggedIn ? (
        <>
          <Card>
            You are current logged in. Sorry, I lied. You still can&apos;t
            really do anything.
          </Card>
          <Card>
            <p>Or if you like, you can reset this instance.</p>
            <Button
              onClick={() => {
                submit({ intent: "resetInstance" }, { method: "post" }).catch(
                  (error: unknown) => {
                    console.error(error);
                  },
                );
              }}
            >
              Reset Instance
            </Button>
          </Card>
          <Card>
            <p>Also you can sign out.</p>
            <Button
              onClick={() => {
                submit({ intent: "signOut" }, { method: "post" }).catch(
                  (error: unknown) => {
                    console.error(error);
                  },
                );
              }}
            >
              Sign out
            </Button>
          </Card>
        </>
      ) : (
        <Card>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <ReactRouterForm method="post" onSubmit={signInForm.handleSubmit}>
            <Input type="hidden" {...signInForm.register("intent")} />
            <p>
              You&apos;re free to play around. But if you want to save anything,
              you&apos;ll need to login.
            </p>
            <TextField
              placeholder="Username"
              {...signInForm.register("username")}
            />
            {signInForm.formState.errors.username?.message && (
              <p className="text-red-500">
                {signInForm.formState.errors.username.message}
              </p>
            )}
            <PasswordField
              placeholder="Password"
              {...signInForm.register("password")}
            />
            {signInForm.formState.errors.password?.message && (
              <p className="text-red-500">
                {signInForm.formState.errors.password.message}
              </p>
            )}
            <Button className="self-end" type="submit">
              Login
            </Button>
          </ReactRouterForm>
        </Card>
      )}
    </PageLayout>
  );
}

export async function action({
  context,
  request,
}: Route.ActionArgs): Promise<Failure | NewInstanceResult | Response> {
  const { data, errors } = await getValidatedFormData(request, actionResolver);
  if (errors) {
    return { error: errors, isSuccess: false };
  }

  const session = await getSession(request.headers.get("Cookie"));

  switch (data.intent) {
    case "newInstance":
      return await newInstance(data);
    case "resetInstance":
      await instance(context).reset();
      return await signOut();
    case "signIn":
      return await signIn(data);
    case "signOut":
      return await signOut();
  }

  async function newInstance({
    email,
    username,
  }: NewInstanceFormData): Promise<NewInstanceResult> {
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
        intent: "newInstance",
        isSuccess: true,
        password: result.password,
      };
    } catch (error: unknown) {
      return {
        error: stringifyError(error),
        isSuccess: false,
      };
    }
  }

  async function signIn({
    password,
    username,
  }: z.infer<typeof signInFormSchema>): Promise<Failure | Response> {
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
  }

  async function signOut(): Promise<Response> {
    return redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
}

type NewInstanceResult = Fallible<{
  intent: "newInstance";
  password: string;
}>;

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isNewInstance = await instance(context).isNew();

  return {
    isLoggedIn: session.has("userId"),
    isNewInstance,
  };
}

const zodUsername = z
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
  );

const newInstanceFormSchema = z.object({
  email: z.string().trim().email(),
  intent: z.literal("newInstance"),
  username: zodUsername,
});

type NewInstanceFormData = z.infer<typeof newInstanceFormSchema>;

const newInstanceResolver = zodResolver(newInstanceFormSchema);

const signInFormSchema = z.object({
  intent: z.literal("signIn"),
  password: z.string(),
  username: zodUsername,
});

const signInResolver = zodResolver(signInFormSchema);

const actionSchema = z.discriminatedUnion("intent", [
  newInstanceFormSchema,
  z.object({ intent: z.literal("resetInstance") }),
  signInFormSchema,
  z.object({ intent: z.literal("signOut") }),
]);

const actionResolver = zodResolver(actionSchema);

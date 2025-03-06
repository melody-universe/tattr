import type { ReactNode } from "react";

import { redirect, useSubmit } from "react-router";
import { z } from "zod";
import { zx } from "zodix";

import type { Failure, Fallible } from "~/utils/types/Fallible";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { Login, useLoginFormController } from "~/modules/login";
import {
  NewInstance,
  useNewInstanceFormController,
} from "~/modules/new-instance";
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
  const submit = useSubmit();

  const newInstanceFormController = useNewInstanceFormController(
    (formValues) => {
      submit({ kind: "newInstance", ...formValues }, { method: "post" }).catch(
        (error: unknown) => {
          console.error(error);
        },
      );
    },
  );

  const loginFormController = useLoginFormController((formValues) => {
    submit({ kind: "signIn", ...formValues }, { method: "post" }).catch(
      (error: unknown) => {
        console.error(error);
      },
    );
  });

  const { isLoggedIn, isNewInstance } = loaderData;
  const password = actionData?.isSuccess ? actionData.password : undefined;

  return (
    <PageLayout>
      <Card>
        Welcome to Tattr. This is a tool for managing crafts for tabletop
        role-playing games.
      </Card>
      {isNewInstance || password ? (
        <NewInstance
          formController={newInstanceFormController}
          password={password}
        />
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
                submit({ kind: "resetInstance" }, { method: "post" }).catch(
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
                submit({ kind: "signOut" }, { method: "post" }).catch(
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
        <Login controller={loginFormController} />
      )}
    </PageLayout>
  );
}

export async function action({
  context,
  request,
}: Route.ActionArgs): Promise<Failure | NewInstanceResult | Response> {
  const session = await getSession(request.headers.get("Cookie"));
  const actionData = await zx.parseForm(request, actionSchema);

  switch (actionData.kind) {
    case "newInstance":
      return await newInstance(actionData);
    case "resetInstance":
      await instance(context).reset();
      return await signOut();
    case "signIn":
      return await signIn(actionData);
    case "signOut":
      return await signOut();
  }

  async function newInstance({
    email,
    username,
  }: z.infer<typeof newInstanceAction>): Promise<NewInstanceResult> {
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
  }

  async function signIn({
    password,
    username,
  }: z.infer<typeof signInAction>): Promise<Failure | Response> {
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
  kind: "newInstance";
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

const newInstanceAction = z.object({
  email: z.string().trim().email(),
  username: zodUsername,
});

const signInAction = z.object({
  password: z.string(),
  username: zodUsername,
});

const actionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("newInstance") }).merge(newInstanceAction),
  z.object({ kind: z.literal("resetInstance") }),
  z.object({ kind: z.literal("signIn") }).merge(signInAction),
  z.object({ kind: z.literal("signOut") }),
]);

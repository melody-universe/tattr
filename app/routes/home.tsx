import type { ReactNode } from "react";
import type { AppLoadContext } from "react-router";

import { redirect, useSubmit } from "react-router";

import type { Failure, Fallible } from "~/utils/types/Fallible";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { Login, useLoginFormValues } from "~/modules/login";
import { NewInstance, useNewInstanceFormValues } from "~/modules/new-instance";
import { auth } from "~/utils/auth.server";
import {
  commitSession,
  getSession,
  type Session,
} from "~/utils/sessions.server";
import { stringifyError } from "~/utils/stringify-error";

import type { Route } from "./+types/home";

export default function Home({
  actionData,
  loaderData,
}: Route.ComponentProps): ReactNode {
  const submit = useSubmit();

  const [newInstanceFormValues, setNewInstanceFormValues] =
    useNewInstanceFormValues();
  const [loginFormValues, setLoginFormValues] = useLoginFormValues();

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
          formValues={newInstanceFormValues}
          onChangeFormValues={setNewInstanceFormValues}
          onSubmit={() => {
            submit(
              { action: "newInstance", ...newInstanceFormValues },
              { method: "post" },
            ).catch((error: unknown) => {
              console.error(error);
            });
          }}
          password={password}
        />
      ) : isLoggedIn ? (
        <Card>
          You are current logged in. Sorry, I lied. You still can&apos;t really
          do anything.
        </Card>
      ) : (
        <Login
          formValues={loginFormValues}
          onChangeFormValues={setLoginFormValues}
          onSubmit={() => {
            submit(
              { action: "login", ...loginFormValues },
              { method: "post" },
            ).catch((error: unknown) => {
              console.error(error);
            });
          }}
        />
      )}
    </PageLayout>
  );
}

export async function action({
  context,
  request,
}: Route.ActionArgs): Promise<Failure | NewInstanceResult | Response> {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const action = formData.get("action");
  if (typeof action !== "string") {
    return { error: "An unexpected error occurred.", isSuccess: false };
  }

  switch (action) {
    case "login": {
      return login(context, session, formData);
    }
    case "newInstance":
      return newInstance(context, formData);
    default:
      return { error: "An unexpected error occurred", isSuccess: false };
  }
}

async function login(
  context: AppLoadContext,
  session: Session,
  formData: FormData,
): Promise<Failure | Response> {
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string") {
    return {
      error: "Please provide a username and password.",
      isSuccess: false,
    };
  }

  const result = await auth(context).verifyCredentials({ password, username });
  if (!result.isSuccess) {
    return result;
  }

  session.set("userId", result.userId);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

async function newInstance(
  context: AppLoadContext,
  formData: FormData,
): Promise<NewInstanceResult> {
  let username = formData.get("username");
  let email = formData.get("email");
  if (typeof username !== "string" || typeof email !== "string") {
    return { error: "Email and username are required", isSuccess: false };
  }

  username = username.trim();
  email = email.trim();
  if (!username || !email) {
    return { error: "Email and username are required", isSuccess: false };
  }

  try {
    if (!(await auth(context).isNewInstance())) {
      return {
        error: "A user already exists in this instance.",
        isSuccess: false,
      };
    }

    const result = await auth(context).createUser({ email, username });
    if (!result.isSuccess) {
      throw result.error;
    }
    return { kind: "newInstance", isSuccess: true, password: result.password };
  } catch (error: unknown) {
    return {
      error: stringifyError(error),
      isSuccess: false,
    };
  }
}

type NewInstanceResult = Fallible<{ kind: "newInstance"; password: string }>;

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isNewInstance = await auth(context).isNewInstance();

  return {
    isLoggedIn: session.has("userId"),
    isNewInstance,
  };
}

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "New React Router App" },
    { content: "Welcome to React Router!", name: "description" },
  ];
}

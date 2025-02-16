import type { ReactNode } from "react";
import type { AppLoadContext } from "react-router";

import { redirect, useSubmit } from "react-router";

import { auth } from "~/utils/auth.server";
import {
  commitSession,
  getSession,
  type Session,
} from "~/utils/sessions.server";
import { stringifyError } from "~/utils/stringify-error";

import type { Route } from "./+types/home";

import { HomePage } from "../home-page/home-page";

export default function Home({
  actionData,
  loaderData,
}: Route.ComponentProps): ReactNode {
  const submit = useSubmit();

  return (
    <HomePage
      createFirstUser={(params) => {
        submit({ action: "newInstance", ...params }, { method: "post" }).catch(
          (error: unknown) => {
            console.error(error);
          },
        );
      }}
      error={actionData?.isSuccess ? undefined : actionData?.error}
      isLoggedIn={loaderData.isLoggedIn}
      isNewInstance={loaderData.isNewInstance}
      login={(params) => {
        submit({ action: "login", ...params }, { method: "post" }).catch(
          (error: unknown) => {
            console.error(error);
          },
        );
      }}
      password={
        actionData?.isSuccess && actionData.kind === "newInstance"
          ? actionData.password
          : undefined
      }
    />
  );
}

export async function action({
  context,
  request,
}: Route.ActionArgs): Promise<ActionResult | Response> {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const action = formData.get("action");
  if (typeof action !== "string") {
    return { error: "An unexpected error occurred.", isSuccess: false };
  }

  switch (action) {
    case "login": {
      const loginResult = await login(context, session, formData);
      if (loginResult.isSuccess) {
        return redirect("/", {
          headers: { "Set-Cookie": await commitSession(session) },
        });
      } else {
        return loginResult;
      }
    }
    case "newInstance":
      return newInstance(context, formData);
    default:
      return { error: "An unexpected error occurred", isSuccess: false };
  }
}

type ActionResult = ErrorResult | LoginResult | NewInstanceResult;

async function login(
  context: AppLoadContext,
  session: Session,
  formData: FormData,
): Promise<LoginResult> {
  const login = formData.get("login");
  const password = formData.get("password");
  if (typeof login !== "string" || typeof password !== "string") {
    return {
      error: "Please provide a login and password.",
      isSuccess: false,
    };
  }

  const result = await auth(context).verifyCredentials({ login, password });
  if (!result.isSuccess) {
    return result;
  }

  session.set("userId", result.userId);

  return { kind: "login", ...result };
}

type LoginResult =
  | ErrorResult
  | { isSuccess: true; kind: "login"; userId: number };

async function newInstance(
  context: AppLoadContext,
  formData: FormData,
): Promise<NewInstanceResult> {
  let login = formData.get("login");
  let email = formData.get("email");
  if (typeof login !== "string" || typeof email !== "string") {
    return { error: "Email and login are required", isSuccess: false };
  }

  login = login.trim();
  email = email.trim();
  if (!login || !email) {
    return { error: "Email and login are required", isSuccess: false };
  }

  try {
    if (!(await auth(context).isNewInstance())) {
      return {
        error: "A user already exists in this instance.",
        isSuccess: false,
      };
    }

    const result = await auth(context).createUser({ email, login });
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

type NewInstanceResult =
  | ErrorResult
  | { isSuccess: true; kind: "newInstance"; password: string };

type ErrorResult = { error: unknown; isSuccess: false };

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

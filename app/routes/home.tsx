import type { ReactNode } from "react";

import { useSubmit } from "react-router";

import { auth } from "~/utils/auth.server";
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
        submit(params, { method: "post" }).catch((error: unknown) => {
          console.error(error);
        });
      }}
      error={actionData?.isSuccess ? undefined : actionData?.error}
      isNewInstance={loaderData.isNewInstance}
      password={actionData?.isSuccess ? actionData.password : undefined}
    />
  );
}

export async function action({
  context,
  request,
}: Route.ActionArgs): Promise<ActionResult> {
  const formData = await request.formData();
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
    return { isSuccess: true, password: result.password };
  } catch (error: unknown) {
    return {
      error: stringifyError(error),
      isSuccess: false,
    };
  }
}

type ActionResult =
  | { error: string; isSuccess: false }
  | { isSuccess: true; password: string };

export async function loader({ context }: Route.LoaderArgs) {
  const isNewInstance = await auth(context).isNewInstance();

  return {
    isNewInstance,
  };
}

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "New React Router App" },
    { content: "Welcome to React Router!", name: "description" },
  ];
}

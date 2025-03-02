import type { ReactNode } from "react";

import { useSubmit } from "react-router";

import type { Failure } from "~/utils/types/Fallible";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { login, Login, useLoginFormController } from "~/modules/login";
import {
  newInstance,
  NewInstance,
  type NewInstanceResult,
  useNewInstanceFormValues,
} from "~/modules/new-instance";
import { assertIsDefined } from "~/utils/assert-is-defined";
import { auth } from "~/utils/auth.server";
import { getSession } from "~/utils/sessions.server";

import type { Route } from "./+types/home";

export default function Home({
  actionData,
  loaderData,
}: Route.ComponentProps): ReactNode {
  const submit = useSubmit();

  const [newInstanceFormValues, setNewInstanceFormValues] =
    useNewInstanceFormValues();
  const loginFormController = useLoginFormController((formValues) => {
    submit({ action: "login", ...formValues }, { method: "post" }).catch(
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
  const formData = await request.formData();
  const action = formData.get("action");
  if (typeof action !== "string") {
    return { error: "An unexpected error occurred.", isSuccess: false };
  }

  switch (action) {
    case "login": {
      assertIsDefined(login);
      return login(context, session, formData);
    }
    case "newInstance":
      assertIsDefined(newInstance);
      return newInstance(context, formData);
    default:
      return { error: "An unexpected error occurred", isSuccess: false };
  }
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isNewInstance = await auth(context).isNewInstance();

  return {
    isLoggedIn: session.has("userId"),
    isNewInstance,
  };
}

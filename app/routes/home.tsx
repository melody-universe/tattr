import type { ReactNode } from "react";

import { redirect, useSubmit } from "react-router";

import type { Failure } from "~/utils/types/Fallible";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { guests } from "~/database/schema";
import {
  Guestbook,
  guestbook,
  useGuestbookFormController,
} from "~/modules/guestbook";
import { login, Login, useLoginFormController } from "~/modules/login";
import {
  newInstance,
  NewInstance,
  type NewInstanceResult,
  useNewInstanceFormController,
} from "~/modules/new-instance";
import { assertIsDefined } from "~/utils/assert-is-defined";
import { instance } from "~/utils/instance.server";
import {
  destroySession,
  getSession,
  type Session,
} from "~/utils/sessions.server";

import type { Route } from "./+types/home";

export default function Home({
  actionData,
  loaderData,
}: Route.ComponentProps): ReactNode {
  const submit = useSubmit();

  const newInstanceFormController = useNewInstanceFormController(
    (formValues) => {
      submit(
        { action: "newInstance", ...formValues },
        { method: "post" },
      ).catch((error: unknown) => {
        console.error(error);
      });
    },
  );

  const loginFormController = useLoginFormController((formValues) => {
    submit({ action: "login", ...formValues }, { method: "post" }).catch(
      (error: unknown) => {
        console.error(error);
      },
    );
  });

  const guestbookController = useGuestbookFormController(() => {
    // do nothing
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
                submit({ action: "resetInstance" }, { method: "post" }).catch(
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
                submit({ action: "signOut" }, { method: "post" }).catch(
                  (error: unknown) => {
                    console.error(error);
                  },
                );
              }}
            >
              Sign out
            </Button>
          </Card>
          <Card>
            <p>These folks have signed the guestbook:</p>
            <ul className="list-disc pl-4">
              {loaderData.guests.map((guest, index) => (
                <li key={index}>
                  <p>
                    {guest.name} ({guest.email})
                  </p>
                  {guest.isBot === 1 && <p>This guest is a bot.</p>}
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <>
          <Login controller={loginFormController} />
          <Guestbook controller={guestbookController} />
        </>
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
  // if (typeof action !== "string") {
  //   return { error: "An unexpected error occurred.", isSuccess: false };
  // }

  switch (action) {
    case "login": {
      assertIsDefined(login);
      return login(context, session, formData);
    }
    case "newInstance":
      assertIsDefined(newInstance);
      return newInstance(context, formData);
    case "resetInstance":
      await instance(context).reset();
      return await signOut(session);
    case "signOut":
      return await signOut(session);
    default:
      assertIsDefined(guestbook);
      return await guestbook(context, formData);
  }
}

async function signOut(session: Session): Promise<Response> {
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isNewInstance = await instance(context).isNew();
  const guestsList = await context.db.select().from(guests);

  return {
    guests: guestsList,
    isLoggedIn: session.has("userId"),
    isNewInstance,
  };
}

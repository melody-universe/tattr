import { type ReactNode } from "react";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { Login, type LoginProps } from "~/modules/login";
import { NewInstance, type NewInstanceProps } from "~/modules/new-instance";

export function HomePage({
  createFirstUser,
  isLoggedIn,
  isNewInstance,
  login,
  password,
}: HomePageProps): ReactNode {
  return (
    <PageLayout>
      <Card>
        Welcome to Tattr. This is a tool for managing crafts for tabletop
        role-playing games.
      </Card>
      {isNewInstance || password ? (
        <NewInstance createFirstUser={createFirstUser} password={password} />
      ) : isLoggedIn ? (
        <Card>
          You are current logged in. Sorry, I lied. You still can&apos;t really
          do anything.
        </Card>
      ) : (
        <Login login={login} />
      )}
    </PageLayout>
  );
}

type HomePageProps = LoginProps &
  NewInstanceProps & {
    error?: string;
    isLoggedIn: boolean;
    isNewInstance: boolean;
  };

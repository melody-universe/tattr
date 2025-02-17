import { type ReactNode, useState } from "react";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { TextField } from "~/components/text-field";

export function HomePage({
  createFirstUser,
  isNewInstance,
  password,
}: HomePageProps): ReactNode {
  return (
    <PageLayout>
      <Card>
        Welcome to Tattr. This is a tool for managing crafts for tabletop
        role-playing games.
      </Card>
      {(isNewInstance || password) && (
        <NewInstanceSection
          createFirstUser={createFirstUser}
          password={password}
        />
      )}
    </PageLayout>
  );
}

type HomePageProps = {
  createFirstUser: (params: { email: string; login: string }) => void;
  error?: string;
  isNewInstance: boolean;
  password?: string;
};

function NewInstanceSection({
  createFirstUser,
  password,
}: NewInstanceSectionProps): ReactNode {
  if (password) {
    return <NewInstancePassword password={password} />;
  }

  return <NewInstanceForm createFirstUser={createFirstUser} />;
}

type NewInstanceSectionProps = Pick<
  HomePageProps,
  "createFirstUser" | "password"
>;

function NewInstancePassword({
  password,
}: NewInstancePasswordProps): ReactNode {
  return (
    <Card>
      <p>Your user has been created. Your password is:</p>
      <pre className="text-wrap">{password}</pre>
    </Card>
  );
}

type NewInstancePasswordProps = { password: string };

function NewInstanceForm({ createFirstUser }: NewInstanceFormProps): ReactNode {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");

  return (
    <form
      onSubmit={(event) => {
        createFirstUser({ email, login });
        event.preventDefault();
      }}
    >
      <Card>
        <p>
          It looks like this is a new instance of Tattr. Ready to get started?
        </p>
        <TextField onChange={setEmail} placeholder="Email" value={email} />
        <TextField onChange={setLogin} placeholder="Login" value={login} />
        <Button className="self-end" type="submit">
          Let&apos;s go
        </Button>
      </Card>
    </form>
  );
}

type NewInstanceFormProps = Pick<HomePageProps, "createFirstUser">;

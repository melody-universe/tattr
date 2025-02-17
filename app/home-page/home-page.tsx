import { type ReactNode, useState } from "react";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";

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
        <NewInstanceSection
          createFirstUser={createFirstUser}
          password={password}
        />
      ) : isLoggedIn ? (
        <Card>
          You are current logged in. Sorry, I lied. You still can&apos;t really
          do anything.
        </Card>
      ) : (
        <LoginSection login={login} />
      )}
    </PageLayout>
  );
}

type HomePageProps = {
  createFirstUser: (params: { email: string; login: string }) => void;
  error?: string;
  isLoggedIn: boolean;
  isNewInstance: boolean;
  login: (params: { login: string; password: string }) => void;
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

function LoginSection({ login: loginAction }: LoginSectionProps): ReactNode {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        loginAction({ login, password });
        event.preventDefault();
      }}
    >
      <Card>
        <p>
          You&apos;re free to play around. But if you want to save anything,
          you&apos;ll need to login.
        </p>
        <TextField onChange={setLogin} placeholder="Login" value={login} />
        <PasswordField
          onChange={setPassword}
          placeholder="Password"
          value={password}
        />
        <Button className="self-end" type="submit">
          Login
        </Button>
      </Card>
    </form>
  );
}

type LoginSectionProps = Pick<HomePageProps, "login">;

import { type ReactNode, useState } from "react";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { TextField } from "~/components/text-field";

export function NewInstance({
  createFirstUser,
  password,
}: NewInstanceProps): ReactNode {
  if (password) {
    return (
      <Card>
        <p>Your user has been created. Your password is:</p>
        <pre className="text-wrap">{password}</pre>
      </Card>
    );
  }

  return <NewInstanceForm createFirstUser={createFirstUser} />;
}

export type NewInstanceProps = NewInstanceFormProps & {
  password?: string;
};

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

type NewInstanceFormProps = {
  createFirstUser: (params: { email: string; login: string }) => void;
};

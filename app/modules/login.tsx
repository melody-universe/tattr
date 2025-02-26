import { type ReactNode, useState } from "react";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PasswordField } from "~/components/password-field";
import { TextField } from "~/components/text-field";

export function Login({ login }: LoginProps): ReactNode {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        login({ password, username });
        event.preventDefault();
      }}
    >
      <Card>
        <p>
          You&apos;re free to play around. But if you want to save anything,
          you&apos;ll need to login.
        </p>
        <TextField
          onChange={setUsername}
          placeholder="Username"
          value={username}
        />
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

export type LoginProps = {
  login: (params: { password: string; username: string }) => void;
};

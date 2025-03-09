import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function PasswordField(props: PasswordFieldProps): ReactNode {
  return <Input type="password" {...props} />;
}

type PasswordFieldProps = Omit<ComponentProps<"input">, "type">;

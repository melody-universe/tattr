import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function PasswordField({
  onChange,
  ...props
}: PasswordFieldProps): ReactNode {
  return (
    <Input
      onChange={(event) => {
        onChange(event.target.value);
      }}
      type="password"
      {...props}
    />
  );
}

type PasswordFieldProps = Omit<ComponentProps<"input">, "onChange" | "type"> & {
  onChange: (value: string) => void;
};

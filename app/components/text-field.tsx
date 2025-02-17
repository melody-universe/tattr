import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function TextField({ onChange, ...props }: TextFieldProps): ReactNode {
  return (
    <Input
      onChange={(event) => {
        onChange(event.target.value);
      }}
      type="text"
      {...props}
    />
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "onChange" | "type"> & {
  onChange: (value: string) => void;
};

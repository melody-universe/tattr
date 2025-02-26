import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function EmailField({ onChange, ...props }: EmailFieldProps): ReactNode {
  return (
    <Input
      onChange={
        onChange
          ? (event): void => {
              onChange(event.target.value);
            }
          : undefined
      }
      type="email"
      {...props}
    />
  );
}

type EmailFieldProps = Omit<ComponentProps<"input">, "onChange" | "type"> & {
  onChange?: (value: string) => void;
};

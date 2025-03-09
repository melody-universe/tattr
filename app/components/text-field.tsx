import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function TextField(props: TextFieldProps): ReactNode {
  return <Input type="text" {...props} />;
}

type TextFieldProps = Omit<ComponentProps<"input">, "type">;

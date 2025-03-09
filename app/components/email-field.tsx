import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function EmailField(props: EmailFieldProps): ReactNode {
  return <Input type="email" {...props} />;
}

type EmailFieldProps = Omit<ComponentProps<"input">, "type">;

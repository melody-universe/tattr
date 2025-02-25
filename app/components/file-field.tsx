import type { ComponentProps, ReactNode } from "react";

import { Input } from "./input";

export function FileField(props: FileFieldProps): ReactNode {
  return <Input type="file" {...props} />;
}

type FileFieldProps = Omit<ComponentProps<"input">, "type">;

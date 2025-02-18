import { type ComponentProps, forwardRef } from "react";

import { mergeClassNames } from "~/utils/merge-class-names";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ className, ...props }, ref) => (
    <button
      className={mergeClassNames(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-fuchsia-300 px-4 py-2 text-sm font-medium whitespace-nowrap text-violet-950 shadow hover:bg-fuchsia-300/90",
        "disabled:cursor-default disabled:bg-fuchsia-400",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Button.displayName = "Button";

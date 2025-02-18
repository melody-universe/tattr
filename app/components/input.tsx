import { type ComponentProps, forwardRef } from "react";

import { mergeClassNames } from "~/utils/merge-class-names";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      className={mergeClassNames(
        "bg-transparentpx-3 flex h-9 max-w-full rounded-md border border-violet-200 px-3 py-1 text-base shadow-sm transition-colors dark:border-violet-800",
        "placeholder:text-violet-300 placeholder:dark:text-violet-700",
        "focus-visible:ring-1 focus-visible:outline-none",
        "md:text-sm",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Input.displayName = "Input";

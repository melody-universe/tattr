import { Root as LabelRoot } from "@radix-ui/react-label";
import { type ComponentRef, forwardRef } from "react";

import { mergeClassNames } from "~/utils/merge-class-names";

export const Label = forwardRef<
  ComponentRef<typeof LabelRoot>,
  React.ComponentPropsWithoutRef<typeof LabelRoot>
>(({ className, ...props }, ref) => (
  <LabelRoot
    className={mergeClassNames(
      "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Label.displayName = "Label";

import { Root as LabelRoot } from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
} from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  useFormContext,
  type UseFormGetFieldState,
} from "react-hook-form";

import { mergeClassNames } from "~/utils/merge-class-names";

import { Label } from "./label";

export { FormProvider as Form } from "react-hook-form";

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>): ReactNode {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField(): FormFieldObject {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { formState, getFieldState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    formDescriptionId: `${id}-form-item-description`,
    formItemId: `${id}-form-item`,
    formMessageId: `${id}-form-item-message`,
    name: fieldContext.name,
    ...fieldState,
  };
}

type FormFieldObject<TFieldValues extends FieldValues = FieldValues> =
  ReturnType<UseFormGetFieldState<TFieldValues>> & {
    formDescriptionId: string;
    formItemId: string;
    formMessageId: string;
    id: string;
    name: string;
  };

export const FormItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={mergeClassNames("space-y-2", className)}
        ref={ref}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export const FormLabel = forwardRef<
  ComponentRef<typeof LabelRoot>,
  ComponentPropsWithoutRef<typeof LabelRoot>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={mergeClassNames(error && "text-destructive", className)}
      htmlFor={formItemId}
      ref={ref}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

export const FormControl = forwardRef<
  ComponentRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formDescriptionId, formItemId, formMessageId } =
    useFormField();

  return (
    <Slot
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      id={formItemId}
      ref={ref}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={mergeClassNames(
        "text-muted-foreground text-[0.8rem]",
        className,
      )}
      id={formDescriptionId}
      ref={ref}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

export const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ children, className, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      className={mergeClassNames(
        "text-destructive text-[0.8rem] font-medium",
        className,
      )}
      id={formMessageId}
      ref={ref}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

type FormItemContextValue = {
  id: string;
};

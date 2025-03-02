import { type Dispatch, type SetStateAction, useState } from "react";
import z from "zod";
import { init } from "zod-empty";

export function useFormController<
  TFormValues,
  TZodType extends z.ZodType<TFormValues>,
>({
  onSubmit: handleSubmit,
  schema,
}: UseFormControllerParams<TZodType>): FormController<TZodType> {
  const [formValues, setFormValues] = useState(() => init(schema));

  const [errors, setErrors] = useState<FormControllerErrors<TZodType>>(null);

  const onSubmit = (): void => {
    const result = schema.safeParse(formValues);
    if (result.success) {
      handleSubmit(formValues);
    } else {
      setErrors(result.error.format());
    }
  };

  return { errors, formValues, onSubmit, setFormValues };
}

type UseFormControllerParams<TZodType extends z.ZodType> = {
  onSubmit: (formValues: z.infer<TZodType>) => void;
  schema: TZodType;
};

export type FormController<TZodType extends z.ZodType> = {
  errors: FormControllerErrors<TZodType>;
  formValues: z.infer<TZodType>;
  onSubmit: () => void;
  setFormValues: Dispatch<SetStateAction<z.infer<TZodType>>>;
};

type FormControllerErrors<TZodType extends z.ZodType> =
  null | z.inferFormattedError<TZodType>;

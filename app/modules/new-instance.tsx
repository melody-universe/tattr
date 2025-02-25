import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/form";
import { TextField } from "~/components/text-field";

export function NewInstance({
  createFirstUser,
  password,
}: NewInstanceProps): ReactNode {
  if (password) {
    return (
      <Card>
        <p>Your user has been created. Your password is:</p>
        <pre className="text-wrap">{password}</pre>
      </Card>
    );
  }

  return <NewInstanceForm createFirstUser={createFirstUser} />;
}

export type NewInstanceProps = NewInstanceFormProps & {
  password?: string;
};

function NewInstanceForm({ createFirstUser }: NewInstanceFormProps): ReactNode {
  const form = useForm<FormValues>({
    defaultValues: { email: "", username: "" },
    resolver: zodResolver(formSchema),
  });

  function onSubmit({ email, username }: FormValues): void {
    createFirstUser({ email, login: username });
  }

  return (
    <Card>
      <p>
        It looks like this is a new instance of Tattr. Ready to get started?
      </p>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <TextField placeholder="user@example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <TextField placeholder="user" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="self-end" type="submit">
            Let&apos;s go
          </Button>
        </form>
      </Form>
    </Card>
  );
}

type NewInstanceFormProps = {
  createFirstUser: (params: { email: string; login: string }) => void;
};

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z.string().min(2).max(50),
  username: z.string().min(2).max(50),
});

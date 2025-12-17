"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const formSchema = z.object({
  email: z.email({ message: "Неверный формат электронной почты" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .max(64, { message: "Пароль должен содержать не более 64 символов" }),
});

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { error } = await authClient.signIn.email({ ...data });
    if (!error) {
      setIsSubmitting(false);
      redirect("/");
    }

    console.error(error);

    if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
      setErrorMessage("Неверный адрес электронной почты или пароль");
    } else {
      setErrorMessage("Неизвестная ошибка");
    }
    setIsSubmitting(false);
  }

  const { watch } = form;
  watch(() => errorMessage && setErrorMessage(undefined));

  return (
    <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-form-email">
                Электронная почта
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="email"
                placeholder="example@example.com"
                name="email"
                id="sign-in-form-email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-form-password">Пароль</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="password"
                placeholder="********"
                name="password"
                id="sign-in-form-password"
              />
              <FieldDescription>
                Пароль должен содержать не менее 8 символов.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button disabled={isSubmitting} type="submit">
            Войти
          </Button>
          {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
      </FieldGroup>
    </form>
  );
}

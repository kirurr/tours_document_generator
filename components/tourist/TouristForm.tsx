"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { ActionResponse } from "@/lib/utils";
import { toast } from "sonner";
import { Tourist } from "@/tourist/schema";

const touristFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(100, { message: "Имя должно содержать не более 100 символов" }),
  age: z
    .number()
    .min(1, { message: "Возраст должен быть больше 0" })
    .max(150, { message: "Возраст не может быть больше 150" }),
  email: z.email({ message: "Неверный формат электронной почты" }),
  phone: z
    .string()
    .min(10, { message: "Телефон должен содержать не менее 10 символов" }),
  dateOfBirth: z.date({
    error: "Введите действительную дату",
  }),
  passport: z
    .string()
    .min(6, { message: "Номер паспорта должен содержать не менее 6 символов" })
    .max(20, {
      message: "Номер паспорта должен содержать не более 20 символов",
    }),
});

type TouristFormValues = z.infer<typeof touristFormSchema>;

const emptyTourist = {
  id: 0,
  name: "",
  age: 18,
  email: "",
  phone: "",
  dateOfBirth: undefined,
  passport: "",
};

export default function TouristForm({
  action,
  defaultData,
  toastMessage,
}: {
  action: (data: TouristFormValues) => Promise<ActionResponse>;
  defaultData?: Tourist;
  toastMessage: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string>();

  const form = useForm<TouristFormValues>({
    resolver: zodResolver(touristFormSchema),
    defaultValues: defaultData ?? emptyTourist,
  });

  async function onSubmit(data: TouristFormValues) {
    const result = await action(data);
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    toast(toastMessage);
    form.reset();
  }

  const { watch } = form;
  watch(() => errorMessage && setErrorMessage(undefined));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-name">ФИО</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="text"
                placeholder="Введите ФИО"
                name="name"
                id="tourist-name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="age"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-age">Возраст</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="number"
                min="1"
                max="150"
                placeholder="Введите возраст"
                name="age"
                id="tourist-age"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-email">Электронная почта</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="email"
                placeholder="Введите ФИО"
                name="email"
                id="tourist-email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-phone">Телефон</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="phone"
                placeholder="Введите номер телефона"
                name="phone"
                id="tourist-phone"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="dateOfBirth"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-date-of-birth">
                Дата рождения
              </FieldLabel>
              <DatePicker
                id="tourist-date-of-birth"
                value={field.value}
                onChange={(date) => {
                  field.onChange(date);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="passport"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tourist-passport">Паспорт</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="text"
                placeholder="Введите данные паспорта"
                name="passport"
                id="tourist-passport"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Отправить
          </Button>
          {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
      </FieldGroup>
    </form>
  );
}

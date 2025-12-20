"use client";

import { ActionResponse } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { Item, ItemActions, ItemContent } from "../ui/item";
import RichTextEditorSection from "./RichTextEditorSection";
import { CustomField } from "@/custom-fields/schema";
import { toast } from "sonner";

const customFieldFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(100, { message: "Имя должно содержать не более 100 символов" }),
  displayName: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(100, { message: "Имя должно содержать не более 100 символов" }),
  description: z
    .string()
    .min(2, { message: "Описание должно содержать не менее 2 символов" })
    .max(1000, { message: "Описание должно содержать не более 1000 символов" })
    .optional()
});

const templateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(100, { message: "Имя должно содержать не более 100 символов" }),
  description: z
    .string()
    .min(2, { message: "Описание должно содержать не менее 2 символов" })
    .max(1000, { message: "Описание должно содержать не более 1000 символов" }),
  body: z
    .string()
    .min(2, { message: "Тело должно содержать не менее 2 символов" })
    .max(10000, { message: "Тело должно содержать не более 10000 символов" }),

  customFields: z.array(customFieldFormSchema),
});

const defaults = {
  name: "",
  description: "",
  body: "",
  customFields: [],
};

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export default function TemplateForm({
  action,
  defaultData,
  toastMessage,
  systemCustomFields,
}: {
  action: (data: TemplateFormValues) => Promise<ActionResponse>;
  defaultData?: TemplateFormValues;
  toastMessage: string;
  systemCustomFields: CustomField[];
}) {
  const [errorMessage, setErrorMessage] = useState<string>();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: defaultData ?? defaults,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields",
  });

  const watchableCustomFields = form.watch("customFields");

  async function onSubmit(data: TemplateFormValues) {
    const result = await action(data);
		if (!result.success) {
			toast.error(result.message);
			return;
		}
    toast.success(toastMessage);
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="">
        <CardHeader>
          <CardTitle>1. Основная информация</CardTitle>
          <CardDescription>
            Введите основную информацию о шаблоне
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="template-name">Имя шаблона</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    placeholder="Введите имя шаблона"
                    name="name"
                    id="template-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="template-description">
                    Описание
                  </FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Введите описание"
                    name="description"
                    id="template-description"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2. Настраиваемые поля</CardTitle>
          <CardDescription>
            Добавьте поля, которые будут доступны в шаблоне
          </CardDescription>
          <CardAction>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                append({ name: "", description: "", displayName: "" });
              }}
            >
              <Plus /> Добавить поле
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <Item key={field.id} variant={"outline"}>
              <ItemContent>Поле {index + 1}</ItemContent>
              <ItemActions>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    remove(index);
                  }}
                >
                  <Trash />
                </Button>
              </ItemActions>
              <FieldGroup>
                <Controller
                  name={`customFields.${index}.name`}
                  control={form.control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`form-rhf-array-name-${index}`}>
                        Имя поля
                      </FieldLabel>
                      <FieldDescription>
                        Имя поля на английском языке, без пробелов
                      </FieldDescription>
                      <Input
                        {...controllerField}
                        id={`form-rhf-array-name-${index}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Введите имя поля"
                        type="text"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`customFields.${index}.displayName`}
                  control={form.control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={`form-rhf-array-displayName-${index}`}
                      >
                        Отображаемое название
                      </FieldLabel>
                      <Input
                        {...controllerField}
                        id={`form-rhf-array-displayName-${index}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Введите название"
                        type="text"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`customFields.${index}.description`}
                  control={form.control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={`form-rhf-array-description-${index}`}
                      >
                        Описание
                      </FieldLabel>
                      <Input
                        {...controllerField}
                        id={`form-rhf-array-description-${index}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Введите описание"
                        type="text"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </Item>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>3. Текст документа</CardTitle>
          <CardDescription>
            Напишите текст и вставляйте поля нажатием на них
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <RichTextEditorSection
                  customFields={[
                    ...systemCustomFields,
                    ...watchableCustomFields.map((field) => ({
                      ...field,
                      type: "single" as const,
                    })),
                  ]}
                  value={field.value}
                  invalid={fieldState.invalid}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
					<Field className="mt-8">
						<Button type="submit" className="w-2/3! block mx-auto">Сохранить</Button>
						{errorMessage && <FieldError>{errorMessage}</FieldError>}
					</Field>
        </CardContent>
      </Card>
    </form>
  );
}

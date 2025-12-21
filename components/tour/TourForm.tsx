"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { Tourist } from "@/tourist/schema";
import TouristTourFormItem from "../tourist/TouristTourFormItem";
import { TouristCustomerCombobox } from "./TouristCustomerCombobox";
import { TouristsCombobox } from "./TouristsCombobox";
import { Button } from "../ui/button";
import { TemplateWithCustomFields } from "@/template/schema";
import { Checkbox } from "../ui/checkbox";
import { FileText } from "lucide-react";
import { ActionResponse } from "@/lib/utils";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const tour_customFieldSchema = z.object({
  customFieldId: z.number(),
  documentTemplateId: z.number(),
  value: z.string(),
});

const tourFormSchema = z.object({
  name: z.string().min(1, { message: "Необходимо указать название тура" }),
  date: z.date({ message: "Необходимо указать дату начала тура" }),
  customerId: z
    .string({ message: "Необходимо выбрать заказчика" })
    .min(1, { message: "Необходимо выбрать заказчика" }),
  touristsIds: z.array(z.string()),
  templatesIds: z.array(z.string()),
  customFieldsArary: z.array(tour_customFieldSchema),
});

export type TourFormData = z.infer<typeof tourFormSchema>;

type Props = {
  tourists: Tourist[];
  templates: TemplateWithCustomFields[];
  action: (data: TourFormData) => Promise<ActionResponse>;
  doRedirect?: boolean;
	defaultData?: TourFormData;
};
export default function ToutForm({
  tourists,
  templates,
  action,
  doRedirect = false,
	defaultData
}: Props) {
  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: defaultData ?? {
      name: "",
      date: undefined,
      customerId: "",
      touristsIds: [],
      templatesIds: [],
      customFieldsArary: [],
    },
  });

  const customerId = form.watch("customerId");
  const selectedTourists = form.watch("touristsIds");
  const selectedTemplates = form.watch("templatesIds");

  const { fields } = useFieldArray({
    control: form.control,
    name: "customFieldsArary",
  });

  async function onSubmit(data: TourFormData) {
    const result = await action(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    if (doRedirect) {
      redirect("/tour");
    }
  }

  function handleCustomFieldChange() {
    const customFields: z.infer<typeof tour_customFieldSchema>[] = [];

    for (const templateId of form.getValues("templatesIds")) {
      const template = templates.find(
        (template) => template.id === Number(templateId),
      );
      if (!template) {
        continue;
      }

      const newValue = template.customFields.map((field) => ({
        customFieldId: field.id,
        value: "",
        documentTemplateId: template.id,
      }));
      customFields.push(...newValue);
    }

    form.setValue("customFieldsArary", customFields);
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>Введите основную информацию о туре</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Название тура</FieldLabel>
                  <Input
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Название тура"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="date">Дата тура</FieldLabel>
                  <DatePicker
                    id="date"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
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
          <CardTitle>Заказчик</CardTitle>
          <CardDescription>Выберите заказчика тура</CardDescription>
        </CardHeader>
        <CardContent>
          {!customerId && (
            <Controller
              name="customerId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <TouristCustomerCombobox
                    id="customerId"
                    aria-label="Туристы"
                    data={tourists.map((tourist) => ({
                      label: tourist.name,
                      value: tourist.id.toString(),
                    }))}
                    value={field.value}
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
          )}
          {customerId && (
            <TouristTourFormItem
              tourist={
                tourists.find((tourist) => tourist.id === Number(customerId))!
              }
              remove={() => {
                form.resetField("customerId");
              }}
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Туристы</CardTitle>
          <CardDescription>Выберите туристов</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="touristsIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <TouristsCombobox
                  aria-label="Туристы"
                  tourists={tourists}
                  customerId={customerId}
                  selectedTourists={field.value}
                  onToggleTourist={(touristId) => {
                    const isSelected = field.value.includes(touristId);
                    if (isSelected) {
                      field.onChange(
                        field.value.filter((id) => id !== touristId),
                      );
                      return;
                    }
                    field.onChange([...field.value, touristId]);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {selectedTourists.map((id) => {
              const tourist = tourists.find(
                (tourist) => tourist.id === Number(id),
              );
              if (!tourist) {
                return null;
              }
              return (
                <TouristTourFormItem
                  key={tourist.id}
                  tourist={tourist}
                  remove={() => {
                    form.setValue(
                      "touristsIds",
                      selectedTourists.filter((item) => item !== id),
                    );
                  }}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Шаблоны документов</CardTitle>
          <CardDescription>Выберите шаблон</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="templatesIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldGroup data-slot="checkbox-group">
                {templates.map((template) => (
                  <Field
                    key={template.id}
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <Checkbox
                      id={`template-${template.id}`}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value.includes(template.id.toString())}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, template.id.toString()]
                          : field.value.filter(
                              (value) => value !== template.id.toString(),
                            );
                        field.onChange(newValue);
                        handleCustomFieldChange();
                      }}
                    />
                    <FieldLabel
                      htmlFor={`template-${template.id}`}
                      className="font-normal"
                    >
                      {template.name}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Заполнение полей шаблонов</CardTitle>
          <CardDescription>
            Заполните необходимые поля для выбранных шаблонов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTemplates.map((id) => {
            const template = templates.find(
              (template) => template.id === Number(id),
            );
            if (!template) {
              return null;
            }

            return (
              <div key={template.id}>
                <div className="flex flex-row items-center gap-2">
                  <FileText className="text-primary" />
                  <h3 className="font-semibold">{template.name}</h3>
                </div>
                <FieldGroup className="mt-4 grid grid-cols-2">
                  {template.customFields.map((field) => (
                    <Controller
                      key={field.id}
                      name={`customFieldsArary.${fields.findIndex((item) => item.customFieldId.toString() === field.id.toString())}.value`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field>
                          <FieldLabel
                            htmlFor={`form-rhf-array-name-${field.id}`}
                          >
                            {field.displayName}
                          </FieldLabel>
                          <FieldContent>
                            <Input
                              {...controllerField}
                              value={controllerField.value ?? ""}
                              id={`form-rhf-array-name-${field.id}`}
                              aria-invalid={fieldState.invalid}
                              placeholder="Введите значение"
                              type="text"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  ))}
                </FieldGroup>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Button type="submit" className="w-2/3! block mx-auto">
        Сохранить
      </Button>
    </form>
  );
}

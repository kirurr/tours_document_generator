import { CustomField } from "@/custom-fields/schema";
import { documentTemplateTable } from "@/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const templateSchema = createSelectSchema(documentTemplateTable);

export type Template = z.infer<typeof templateSchema>;

export const createTemplateSchema = createInsertSchema(documentTemplateTable);

export type CreateTemplate = z.infer<typeof createTemplateSchema>;

export const updateTemplateSchema = createInsertSchema(documentTemplateTable);

export type UpdateTemplate = Partial<
  Omit<z.infer<typeof updateTemplateSchema>, "id">
>;

export type TemplateWithCustomFields = Template & {
  customFields: CustomField[];
};

import { customFieldTable } from "@/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const customFieldSchema = createSelectSchema(customFieldTable, {
	description: z.string().optional().nullable(),
	documentTemplateId: z.number().optional().nullable()
});

export type CustomField = z.infer<typeof customFieldSchema>;

export const createCustomFieldSchema = createInsertSchema(customFieldTable);

export type CreateCustomField = z.infer<typeof createCustomFieldSchema>;

export const updateCustomFieldSchema = createInsertSchema(customFieldTable);

export type UpdateCustomField = Partial<
  Omit<z.infer<typeof updateCustomFieldSchema>, "id">
>;

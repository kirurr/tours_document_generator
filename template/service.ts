import { db } from "@/database/drizzle";
import { CreateTemplate, Template, TemplateWithCustomFields, UpdateTemplate } from "./schema";
import { ilike, or, SQL, desc, eq } from "drizzle-orm";
import { customFieldTable, documentTemplateTable } from "@/database/schema";
import { CreateCustomField, CustomField } from "@/custom-fields/schema";

export async function deleteTemplate(id: number): Promise<void> {
  try {
		await db.transaction(async (trx) => {
			await trx.delete(customFieldTable).where(eq(customFieldTable.documentTemplateId, id));

			await trx
				.delete(documentTemplateTable)
				.where(eq(documentTemplateTable.id, id));
		});
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
}

export async function updateTemplateWithCustomFields(
	id: number,
  template: UpdateTemplate,
  fields: CreateCustomField[],
): Promise<void> {
  try {
    await db.transaction(async (trx) => {
      await trx
        .update(documentTemplateTable)
        .set(template)
				.where(eq(documentTemplateTable.id, id))

      for (const field of fields) {
        if (field.id) {
          await trx
            .update(customFieldTable)
            .set(field)
            .where(eq(customFieldTable.id, field.id));
          continue;
        }
        await trx
          .insert(customFieldTable)
          .values({ ...field, documentTemplateId: id });
      }
    });
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }

}

export async function createTemplateWithCustomFields(
  template: CreateTemplate,
  fields: CreateCustomField[],
): Promise<void> {
  try {
    await db.transaction(async (trx) => {
      const [newTemplate] = await trx
        .insert(documentTemplateTable)
        .values(template)
        .returning();

      if (fields.length === 0) {
        return;
      }

      for (const field of fields) {
        if (field.id) {
          await trx
            .update(customFieldTable)
            .set(field)
            .where(eq(customFieldTable.id, field.id));
          continue;
        }
        await trx
          .insert(customFieldTable)
          .values({ ...field, documentTemplateId: newTemplate.id });
      }
    });
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
}

/**
 * Creates a new template record
 */
export async function createTemplate(data: CreateTemplate): Promise<Template> {
  try {
    const [newTemplate] = await db
      .insert(documentTemplateTable)
      .values(data)
      .returning();

    if (!newTemplate) {
      throw new Error("Failed to create tourist");
    }

    return newTemplate;
  } catch (error) {
    console.error("Error creating tourist:", error);
    throw error;
  }
}

/**
 * Gets all templates with optional filtering
 */
export async function getTemplateById(
  id: number,
): Promise<TemplateWithCustomFields | null> {
  try {
    const rows = await db
      .select()
      .from(documentTemplateTable)
      .leftJoin(
        customFieldTable,
        eq(customFieldTable.documentTemplateId, documentTemplateTable.id),
      )
      .where(eq(documentTemplateTable.id, id))
      .orderBy(desc(documentTemplateTable.id));

		if (rows.length === 0) {
			return null;
		}

    return joinFields(rows)[0];
  } catch (error) {
    console.error("Error getting all templates:", error);
    throw error;
  }
}

/**
 * Gets all templates with optional filtering
 */
export async function getAllTemplates(filters?: {
  name?: string;
  description?: string;
}): Promise<TemplateWithCustomFields[]> {
  const query: SQL[] = [];
  try {
    if (filters) {
      if (filters.name) {
        query.push(ilike(documentTemplateTable.name, `%${filters.name}%`));
      } else if (filters.description) {
        query.push(
          ilike(documentTemplateTable.description, `%${filters.description}%`),
        );
      }
    }

    const rows = await db
      .select()
      .from(documentTemplateTable)
      .leftJoin(
        customFieldTable,
        eq(customFieldTable.documentTemplateId, documentTemplateTable.id),
      )
      .where(or(...query))
      .orderBy(desc(documentTemplateTable.id));

    return joinFields(rows);
  } catch (error) {
    console.error("Error getting all templates:", error);
    throw error;
  }
}

function joinFields(
  rows: {
    document_template: Template;
    custom_field: CustomField | null;
  }[],
): TemplateWithCustomFields[] {
  const templates: TemplateWithCustomFields[] = [];

  for (const row of rows) {
    const template = row.document_template;
    const customField = row.custom_field;

    let existing = templates.find((t) => t.id === template.id);

    if (!existing) {
      existing = {
        ...template,
        customFields: [],
      };
      templates.push(existing);
    }

    if (customField) {
      existing.customFields.push(customField);
    }
  }
  return templates;
}

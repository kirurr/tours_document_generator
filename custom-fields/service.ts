import { db } from "@/database/drizzle";
import { CreateCustomField, CustomField } from "./schema";
import { ilike, and, or, SQL, desc, isNull, eq } from "drizzle-orm";
import { customFieldTable } from "@/database/schema";

/**
 * Creates a new customField record
 */
export async function createCustomField(
  data: CreateCustomField,
): Promise<CustomField> {
  try {
    const [newCustomField] = await db
      .insert(customFieldTable)
      .values(data)
      .returning();

    if (!newCustomField) {
      throw new Error("Failed to create tourist");
    }

    return newCustomField;
  } catch (error) {
    console.error("Error creating tourist:", error);
    throw error;
  }
}

/**
 * Gets all customFields with optional filtering
 */
export async function getAllCustomFields(filters?: {
  documentId?: number;
  name?: string;
  description?: string;
}): Promise<CustomField[]> {
  const conditions: SQL[] = [];

  try {
    if (filters) {
      if (filters.documentId) {
        conditions.push(
          eq(customFieldTable.documentTemplateId, filters.documentId),
        );
      }

      if (filters.name) {
        conditions.push(ilike(customFieldTable.name, `%${filters.name}%`));
      }

      if (filters.description) {
        conditions.push(
          ilike(customFieldTable.description, `%${filters.description}%`),
        );
      }
    }

    return await db
      .select()
      .from(customFieldTable)
      .where(
        and(or(...conditions), isNull(customFieldTable.documentTemplateId)),
      )
      .orderBy(desc(customFieldTable.id));
  } catch (error) {
    console.error("Error getting all customFields:", error);
    throw error;
  }
}

import { db } from "@/database/drizzle";
import { touristTable } from "@/database/schema";
import { eq, ilike, or, SQL, desc } from "drizzle-orm";
import { Tourist, CreateTourist, UpdateTourist } from "./schema";

/**
 * Creates a new tourist record
 */
export async function createTourist(data: CreateTourist): Promise<Tourist> {
  try {
    const [newTourist] = await db.insert(touristTable).values(data).returning();

    if (!newTourist) {
      throw new Error("Failed to create tourist");
    }

    return newTourist;
  } catch (error) {
    console.error("Error creating tourist:", error);
    throw error;
  }
}

/**
 * Gets a tourist by ID
 */
export async function getTouristById(id: number): Promise<Tourist | null> {
  try {
    const tourist = await db.query.touristTable.findFirst({
      where: eq(touristTable.id, id),
    });

    return tourist || null;
  } catch (error) {
    console.error("Error getting tourist by ID:", error);
    throw error;
  }
}

/**
 * Gets all tourists with optional filtering
 */
export async function getAllTourists(filters?: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<Tourist[]> {
  const query: SQL[] = [];
  try {
    if (filters) {
      if (filters.name) {
        query.push(ilike(touristTable.name, `%${filters.name}%`));
      } else if (filters.email) {
        query.push(ilike(touristTable.email, `%${filters.email}%`));
      } else if (filters.phone) {
        query.push(ilike(touristTable.phone, `%${filters.phone}%`));
      }
    }

    return await db
      .select()
      .from(touristTable)
      .where(or(...query))
      .orderBy(desc(touristTable.id));
  } catch (error) {
    console.error("Error getting all tourists:", error);
    throw error;
  }
}

/**
 * Updates a tourist record by ID
 */
export async function updateTourist(
  id: number,
  data: UpdateTourist,
): Promise<Tourist | null> {
  try {
    const [updatedTourist] = await db
      .update(touristTable)
      .set(data)
      .where(eq(touristTable.id, id))
      .returning();

    return updatedTourist || null;
  } catch (error) {
    console.error("Error updating tourist:", error);
    throw error;
  }
}

/**
 * Deletes a tourist by ID
 */
export async function deleteTourist(id: number): Promise<boolean> {
  try {
    const deletedRecords = await db
      .delete(touristTable)
      .where(eq(touristTable.id, id))
      .execute();

    // Check if any record was actually deleted
    return Number(deletedRecords.rowCount) > 0;
  } catch (error) {
    console.error("Error deleting tourist:", error);
    throw error;
  }
}

// Export all methods for easy import
export const TouristService = {
  createTourist,
  getTouristById,
  getAllTourists,
  updateTourist,
  deleteTourist,
};

import { touristTable } from "@/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const touristSchema = createSelectSchema(touristTable);

export type Tourist = z.infer<typeof touristSchema>;

export const createTouristSchema = createInsertSchema(touristTable);

export type CreateTourist = z.infer<typeof createTouristSchema>;

export const updateTouristSchema = createInsertSchema(touristTable);

export type UpdateTourist = Partial<
  Omit<z.infer<typeof updateTouristSchema>, "id">
>;

import {
  tour_custom_fieldTable,
  tour_touristTable,
  tourTable,
} from "@/database/schema";
import { TemplateWithCustomFields } from "@/template/schema";
import { Tourist } from "@/tourist/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const tourSchema = createSelectSchema(tourTable);

export type Tour = z.infer<typeof tourSchema>;

export const createTourSchema = createInsertSchema(tourTable);

export type CreateTour = z.infer<typeof createTourSchema>;

export const tour_touristSchema = createSelectSchema(tour_touristTable);

export type Tour_tourist = z.infer<typeof tour_touristSchema>;

export const tour_customFieldSchema = createSelectSchema(
  tour_custom_fieldTable,
);

export type Tour_customField = z.infer<typeof tour_customFieldSchema>;

export const createTour_customFieldSchema = createInsertSchema(
  tour_custom_fieldTable,
);

export type CreateTour_customField = z.infer<
  typeof createTour_customFieldSchema
>;

export type TourWithData = Tour & {
  customer: Tourist | null;
  tourists: Tourist[];
  customFieldsValues: Tour_customField[];
  templates: TemplateWithCustomFields[];
};

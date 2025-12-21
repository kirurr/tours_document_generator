import { db } from "@/database/drizzle";
import {
  tour_custom_fieldTable,
  tour_templateTable,
  tour_touristTable,
  touristTable,
  tourTable,
} from "@/database/schema";
import { getTemplatesByTourId } from "@/template/service";
import { and, eq, ilike, SQL } from "drizzle-orm";
import { CreateTour, CreateTour_customField, TourWithData } from "./schema";

type CreateTourInput = {
  tour: CreateTour;
  touristsIds: number[];
  templatesIds: number[];
  customFields: Array<Omit<CreateTour_customField, "tourId">>;
};

type UpdateTourInput = {
  id: number;
  tour: Partial<CreateTour>;
  touristsIds?: number[];
  templatesIds?: number[];
  customFields?: Array<Omit<CreateTour_customField, "tourId">>;
};
export async function createTour(data: CreateTourInput): Promise<void> {
  return await db.transaction(async (trx) => {
		console.log(data)
    const [tour] = await trx.insert(tourTable).values(data.tour).returning();

		if (data.touristsIds.length > 0) {
			await trx
				.insert(tour_touristTable)
				.values(
					data.touristsIds.map((id) => ({ tourId: tour.id, touristId: id })),
				);
		}

    await trx
      .insert(tour_templateTable)
      .values(
        data.templatesIds.map((id) => ({ tourId: tour.id, templateId: id })),
      );

    await trx
      .insert(tour_custom_fieldTable)
      .values(
        data.customFields.map((field) => ({ tourId: tour.id, ...field })),
      );
  });
}

export async function updateTour(data: UpdateTourInput): Promise<void> {
  return await db.transaction(async (trx) => {
    // Update the tour record itself
    await trx.update(tourTable).set(data.tour).where(eq(tourTable.id, data.id));

    // Handle tourists relationship - first delete existing, then insert new
    if (data.touristsIds !== undefined) {
      await trx.delete(tour_touristTable).where(eq(tour_touristTable.tourId, data.id));
      if (data.touristsIds.length > 0) {
        await trx
          .insert(tour_touristTable)
          .values(
            data.touristsIds.map((id) => ({ tourId: data.id, touristId: id })),
          );
      }
    }

    // Handle templates relationship - first delete existing, then insert new
    if (data.templatesIds !== undefined) {
      await trx.delete(tour_templateTable).where(eq(tour_templateTable.tourId, data.id));
      if (data.templatesIds.length > 0) {
        await trx
          .insert(tour_templateTable)
          .values(
            data.templatesIds.map((id) => ({ tourId: data.id, templateId: id })),
          );
      }
    }

    // Handle custom fields - first delete existing, then insert new
    if (data.customFields !== undefined) {
      await trx.delete(tour_custom_fieldTable).where(eq(tour_custom_fieldTable.tourId, data.id));
      if (data.customFields.length > 0) {
        await trx
          .insert(tour_custom_fieldTable)
          .values(
            data.customFields.map((field) => ({ tourId: data.id, ...field })),
          );
      }
    }
  });
}

export async function getAllTours(filters?: {
  name?: string;
}): Promise<TourWithData[]> {
  const where: SQL[] = [];

  if (filters?.name) {
    where.push(ilike(tourTable.name, `%${filters.name}%`));
  }

  const tours = await db
    .select()
    .from(tourTable)
    .leftJoin(touristTable, eq(tourTable.customerId, touristTable.id))
    .where(and(...where));

  const toursWithData: TourWithData[] = [];

  for (const tour of tours) {
    // Get tourists for this tour
    const touristsResult = await db
      .select()
      .from(touristTable)
      .leftJoin(
        tour_touristTable,
        eq(tour_touristTable.touristId, touristTable.id),
      )
      .where(eq(tour_touristTable.tourId, tour.tour.id));

    // Get templates for this tour
    const templates = await getTemplatesByTourId(tour.tour.id);

    // Get custom fields values for this tour
    const customFieldsValues = await db
      .select()
      .from(tour_custom_fieldTable)
      .where(eq(tour_custom_fieldTable.tourId, tour.tour.id));

    toursWithData.push({
      ...tour.tour,
      customer: tour.tourist,
      tourists: touristsResult.map((t) => t.tourist),
      templates: templates,
      customFieldsValues: customFieldsValues,
    });
  }

  return toursWithData;
}

export async function getTourById(id: number): Promise<TourWithData | null> {
  const [tour] = await db
    .select()
    .from(tourTable)
    .leftJoin(touristTable, eq(tourTable.customerId, touristTable.id))
    .where(eq(tourTable.id, id));

  if (!tour) {
    return null;
  }

  const tourists = await db
    .select()
    .from(touristTable)
    .leftJoin(
      tour_touristTable,
      eq(tour_touristTable.touristId, touristTable.id),
    )
    .where(eq(tour_touristTable.tourId, id));

  const templates = await getTemplatesByTourId(id);

  const customFieldsValues = await db
    .select()
    .from(tour_custom_fieldTable)
    .where(eq(tour_custom_fieldTable.tourId, id));

  return {
    ...tour.tour,
    customer: tour.tourist,
    tourists: tourists.map((t) => t.tourist),
    templates: templates,
    customFieldsValues: customFieldsValues,
  };
}

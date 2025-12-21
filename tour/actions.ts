"use server";

import { TourFormData } from "@/components/tour/TourForm";
import { createTour, updateTour } from "./service";
import HtmlToDocx from "@turbodocx/html-to-docx";

export async function getDocxBlobFromHTML(html: string) {
  const docx = await HtmlToDocx(html, null, {
    decodeUnicode: true,
    preprocessing: { skipHTMLMinify: true },
  });

	const arrayBuffer = docx.slice(0);
	return new Blob([arrayBuffer]);

}

export async function createTourAction(data: TourFormData) {
  try {
    await createTour({
      tour: {
        name: data.name,
        date: data.date,
        customerId: Number(data.customerId),
      },
      touristsIds: data.touristsIds.map(Number),
      templatesIds: data.templatesIds.map(Number),
      customFields: data.customFieldsArary,
    });
    return {
      success: true,
      message: "Tour created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create tour",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateTourAction(id: number, data: TourFormData) {
  try {
    await updateTour({
      id: id,
      tour: {
        name: data.name,
        date: data.date,
        customerId: Number(data.customerId),
      },
      touristsIds: data.touristsIds.map(Number),
      templatesIds: data.templatesIds.map(Number),
      customFields: data.customFieldsArary,
    });
    return {
      success: true,
      message: "Tour updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update tour",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
